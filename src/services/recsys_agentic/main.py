from __future__ import annotations

import os
from pathlib import Path
from typing import List, Literal, Optional, Dict, Any

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone

from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai

# ---------- Config ----------
APP_DIR = Path(__file__).resolve().parent  # src/services/recsys_agentic
SERVICES_DIR = APP_DIR.parent  # src/services
SRC_DIR = SERVICES_DIR.parent  # src
ROOT_DIR = SRC_DIR.parent  # project root

# Load .env.local from project root
env_path = ROOT_DIR / ".env.local"
if env_path.exists():
    load_dotenv(env_path)
    print(f"✅ Loaded environment from: {env_path}")
else:
    print(f"⚠️ No .env.local found at: {env_path}")
    load_dotenv()  # Try to load from system env

MODEL_DIR = SERVICES_DIR / "model"

# Try multiple env var names for compatibility
VITE_SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
VITE_SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

TOP_N_DEFAULT = 5

# ---------- FastAPI ----------
app = FastAPI(title="Telvora Inference Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Models ----------
class AnalyticRequest(BaseModel):
    customer_id: str
    top_n: Optional[int] = TOP_N_DEFAULT

class RecommendationItem(BaseModel):
    product_id: Optional[str] = None
    product_name: str
    category: str
    price: float
    duration_days: int
    reasons: List[str]

class ChurnResult(BaseModel):
    probability: float
    label: Literal["low", "medium", "high"]
    raw_label: str

class AnalyticResponse(BaseModel):
    recommendations: Dict[str, Any]
    churn: ChurnResult
    user_category: str
    generated_at: str
    ai_insights: Optional[Dict[str, str]] = None

# ---------- Load artifacts ----------
clf = None
label_encoder = None
global_averages: Dict[str, float] | None = None

TARGET_TO_CATEGORY_MAP = {
    'Data Booster': 'Data',
    'Voice Bundle': 'Voice',
    'Streaming Partner Pack': 'VOD',
    'Family Plan Offer': 'Combo',
    'Retention Offer': 'Combo',
    'Top-up Promo': 'Data',
    'General Offer': 'Combo',
    'Roaming Pass': 'Roaming',
    'Device Upgrade Offer': 'DeviceBundle',
}

CATEGORY_SORTING_LOGIC = {
    'Data': ('product_capacity_gb', False, 'Rekomendasi Utama (Data Kuota Terbesar):'),
    'Voice': ('product_capacity_minutes', False, 'Rekomendasi Utama (Voice Menit Terbanyak):'),
    'VOD': ('price', True, 'Rekomendasi Utama (VOD Harga Termurah):'),
    'Combo': ('price', True, 'Rekomendasi Utama (Combo Value Terbaik/Termurah):'),
    'Roaming': ('price', True, 'Rekomendasi Utama (Roaming Harga Termurah):'),
    'DeviceBundle': ('price', False, 'Rekomendasi Utama (Device Bundle Premium):'),
    'SMS': ('price_per_sms', True, 'Rekomendasi Tambahan (SMS Best Value):'),
}

CALL_THRESHOLD = 10.0
VOD_THRESHOLD = 0.4
SMS_THRESHOLD = 15.0

supabase: Optional[Client] = None
model_llm = None


def call_gemini_safe(prompt: str) -> str:
    """Wrapper aman untuk memanggil Gemini dengan Error Handling"""
    try:
        if model_llm is None:
            return "AI insights tidak tersedia (Gemini API tidak terkonfigurasi)."
        response = model_llm.generate_content(prompt)
        if response.text:
            return response.text
        else:
            return "AI tidak memberikan respons teks."
    except Exception as e:
        return f"Gagal memuat analisis AI: {str(e)}"


def gemini_user_product_insight(pred_label: str, user_profile: Dict[str, Any], recommendations: List[RecommendationItem]) -> str:
    """Generate product recommendation insights using Gemini AI"""
    # Format recommendations for prompt
    recs_text = "\n".join([
        f"- {item.product_name} ({item.category}) - Rp {item.price:,.0f} / {item.duration_days} hari"
        for item in recommendations[:3]
    ])
    
    prompt = f"""
Role: Senior Product Marketing Analyst Telco.
Konteks: Analisis rekomendasi produk untuk pelanggan individual.

Data Pelanggan:
- Status Prediksi AI: {pred_label} (Kebutuhan utama pelanggan)
- Pengeluaran Bulanan: Rp {user_profile.get('monthly_spend', 0):,.0f}
- Penggunaan Data: {user_profile.get('avg_data_usage_gb', 0):.1f} GB/bulan
- Video Streaming: {user_profile.get('pct_video_usage', 0):.1f}%
- Durasi Panggilan: {user_profile.get('avg_call_duration', 0):.1f} menit

Produk yang Direkomendasikan:
{recs_text}

Tugas:
Buatkan deskripsi singkat (maksimal 3 kalimat) yang menjelaskan:
1. Mengapa produk-produk ini cocok untuk pelanggan berdasarkan profil penggunaan mereka
2. Benefit utama yang akan didapatkan pelanggan
3. Saran cara menawarkan produk dengan persuasif

Gunakan bahasa yang profesional namun mudah dipahami.
"""
    return call_gemini_safe(prompt)


def gemini_churn_analysis(churn_proba: float, user_profile: Dict[str, Any], pred_label: str) -> str:
    """Generate churn risk analysis using Gemini AI"""
    churn_pct = churn_proba * 100
    risk_level = "TINGGI" if churn_proba > 0.5 else "SEDANG" if churn_proba > 0.2 else "RENDAH"
    
    prompt = f"""
Role: Senior Customer Retention Analyst Telco.
Konteks: Analisis risiko churn pelanggan.

Data Pelanggan:
- Probabilitas Churn: {churn_pct:.1f}% (Risiko: {risk_level})
- Kategori Prediksi: {pred_label}
- Frekuensi Komplain: {user_profile.get('complaint_count', 0)} kali
- Pengeluaran Bulanan: Rp {user_profile.get('monthly_spend', 0):,.0f}
- Frekuensi Top-up: {user_profile.get('topup_freq', 0)}x/bulan
- Travel Score: {user_profile.get('travel_score', 0):.2f}

Tugas:
Buatkan analisis singkat (maksimal 3 kalimat) yang menjelaskan:
1. Faktor-faktor utama yang mempengaruhi tingkat risiko churn ini
2. Insight tentang perilaku pelanggan yang perlu diperhatikan
3. Strategi retensi yang disarankan untuk mengurangi risiko churn

Gunakan bahasa yang profesional dan actionable.
"""
    return call_gemini_safe(prompt)


def load_artifacts() -> None:
    global clf, label_encoder, global_averages, supabase, model_llm
    model_path = MODEL_DIR / "model_dokter_rf.pkl"
    le_path = MODEL_DIR / "label_encoder.pkl"
    ga_path = MODEL_DIR / "global_averages.pkl"

    if not model_path.exists() or not le_path.exists() or not ga_path.exists():
        raise RuntimeError(f"Model artifacts not found in: {MODEL_DIR}")

    clf = joblib.load(model_path)
    label_encoder = joblib.load(le_path)
    global_averages = joblib.load(ga_path)

    global supabase
    if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY:
        supabase = create_client(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
        print(f"✅ Supabase client initialized successfully ({VITE_SUPABASE_URL[:30]}...)")
    else:
        print("⚠️ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set - database features will be limited")
        print("   Set these in .env.local file or as environment variables")
        supabase = None
    
    # Initialize Gemini AI
    if GEMINI_API_KEY:
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            # Use gemini-pro (stable and widely available)
            model_llm = genai.GenerativeModel('gemini-2.0-flash-lite')
            print("✅ Gemini AI initialized successfully (gemini-2.0-flash-lite)")
        except Exception as e:
            print(f"⚠️ Gemini AI initialization failed: {e}")
            model_llm = None
    else:
        print("⚠️ GEMINI_API_KEY not set - AI insights will be disabled")


def abs_if_needed(df: pd.DataFrame, col: str) -> None:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        df[col] = df[col].abs()


def prepare_features(customer_row: Dict[str, Any]) -> pd.DataFrame:
    # Build a single-row DataFrame with expected columns
    # Columns inferred from training logic
    df = pd.DataFrame([customer_row])

    # Ensure numeric conversions similar to training
    numeric_features_list = [
        'avg_data_usage_gb', 'pct_video_usage', 'avg_call_duration', 'sms_freq',
        'monthly_spend', 'topup_freq', 'travel_score', 'complaint_count'
    ]

    # Replace comma decimal and coerce
    for col in numeric_features_list:
        if col in df.columns:
            if isinstance(df[col].iloc[0], str):
                df[col] = df[col].astype(str).str.replace(',', '.')
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

    # Apply abs fix for negatives
    abs_if_needed(df, 'avg_call_duration')
    abs_if_needed(df, 'monthly_spend')

    # Drop ID and target-like cols if present
    for drop_col in ('customer_id', 'target_offer', 'target_encoded'):
        if drop_col in df.columns:
            df = df.drop(columns=[drop_col])

    return df


def fetch_customer(customer_id: str) -> Dict[str, Any]:
    if supabase is None:
        raise HTTPException(status_code=503, detail='Database not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
    res = supabase.table('customer_profile').select('*').eq('customer_id', customer_id).single().execute()
    if res.data is None:
        raise HTTPException(status_code=404, detail='Customer not found')
    return res.data


def fetch_products() -> pd.DataFrame:
    if supabase is None:
        raise HTTPException(status_code=503, detail='Database not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
    res = supabase.table('product_catalog').select('*').execute()
    products = res.data or []
    if not products:
        raise HTTPException(status_code=404, detail='No products found')
    df = pd.DataFrame(products)
    # Add derived columns
    eps = 1e-6
    df['price_per_gb'] = df['price'] / (df.get('product_capacity_gb', 0) + eps)
    df['price_per_minute'] = df['price'] / (df.get('product_capacity_minutes', 0) + eps)
    df['price_per_sms'] = df['price'] / (df.get('product_capacity_sms', 0) + eps)
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    return df


def compute_churn(proba: float) -> str:
    if proba < 0.20:
        return 'low'
    if proba < 0.50:
        return 'medium'
    return 'high'


def recommend_products(pred_label: str, user_df: pd.DataFrame, products_df: pd.DataFrame, total_recommendations: int) -> List[RecommendationItem]:
    recs: List[RecommendationItem] = []
    seen = set()

    budget = float(user_df['monthly_spend'].iloc[0]) if 'monthly_spend' in user_df.columns else 0.0
    budget_multiplier = 1.5  # Allow up to 150% of budget for flexibility
    primary_category = TARGET_TO_CATEGORY_MAP.get(pred_label)

    # FASE 1: Primary Recommendations (target 3 produk)
    if primary_category:
        sort_col, sort_asc, desc = CATEGORY_SORTING_LOGIC.get(primary_category, ('price', True, 'Rekomendasi Utama:'))
        
        # Try with strict filters first (30 days, within budget)
        filtered = products_df[
            (products_df['category'] == primary_category) & (products_df['duration_days'] == 30)
        ].copy()
        if primary_category not in ['DeviceBundle', 'Retention Offer']:
            filtered = filtered[filtered['price'] <= budget * budget_multiplier]
        
        # Fallback 1: Relax duration constraint if not enough products
        if len(filtered) < 3:
            filtered = products_df[
                (products_df['category'] == primary_category)
            ].copy()
            if primary_category not in ['DeviceBundle', 'Retention Offer']:
                filtered = filtered[filtered['price'] <= budget * budget_multiplier]
        
        # Fallback 2: Remove budget constraint if still not enough
        if len(filtered) < 3:
            filtered = products_df[
                (products_df['category'] == primary_category)
            ].copy()
        
        top_primary = filtered.sort_values(by=sort_col, ascending=sort_asc).head(3)
        for _, row in top_primary.iterrows():
            recs.append(RecommendationItem(
                product_id=str(row.get('product_id') or ''),
                product_name=str(row['product_name']),
                category=str(row['category']),
                price=float(row['price']),
                duration_days=int(row['duration_days']),
                reasons=[desc, f"Sesuai prediksi model: {pred_label}"]
            ))
            seen.add(row['product_name'])

    remaining = total_recommendations - len(recs)

    # FASE 2: Secondary Recommendations based on usage profile
    if remaining > 0 and global_averages is not None:
        data_usage = float(user_df.get('avg_data_usage_gb', pd.Series([0])).iloc[0])
        call_usage = float(user_df.get('avg_call_duration', pd.Series([0])).iloc[0])
        vod_usage = float(user_df.get('pct_video_usage', pd.Series([0])).iloc[0])
        sms_usage = float(user_df.get('sms_freq', pd.Series([0])).iloc[0])
        
        # Calculate usage scores
        scores = [
            ('Data', data_usage / (global_averages['avg_data_usage_gb'] + 1e-6), 'price_per_gb', True),
            ('Voice', call_usage / (global_averages['avg_call_duration'] + 1e-6), 'price_per_minute', True),
            ('VOD', vod_usage / (global_averages['pct_video_usage'] + 1e-6), 'price', True),
            ('SMS', sms_usage / (global_averages['sms_freq'] + 1e-6), 'price_per_sms', True),
            ('Combo', 1.0, 'price', True),  # Always include Combo as option
            ('Roaming', 0.8, 'price', True),  # Include Roaming as general option
        ]
        
        # Sort by usage score (prioritize high usage categories)
        sorted_scores = sorted([s for s in scores if s[1] > 0.5], key=lambda x: x[1], reverse=True)
        
        for cat, score, sort_col, sort_asc in sorted_scores:
            if remaining <= 0:
                break
            
            # Skip if same as primary category
            if primary_category and cat == primary_category:
                continue
            
            # Try multiple strategies to find products
            filtered_sec = None
            reason_suffix = ""
            
            # Strategy 1: Short duration (7-15 days), within budget
            filtered_sec = products_df[
                (products_df['category'] == cat) &
                (products_df['duration_days'] >= 7) & (products_df['duration_days'] <= 15) &
                (products_df['price'] <= budget * budget_multiplier) &
                (~products_df['product_name'].isin(seen))
            ].copy()
            reason_suffix = "Paket pendek sesuai profil"
            
            # Strategy 2: Standard 30 days, within budget
            if filtered_sec.empty:
                filtered_sec = products_df[
                    (products_df['category'] == cat) &
                    (products_df['duration_days'] == 30) &
                    (products_df['price'] <= budget * budget_multiplier) &
                    (~products_df['product_name'].isin(seen))
                ].copy()
                reason_suffix = "Paket bulanan sesuai profil"
            
            # Strategy 3: Any duration, within extended budget
            if filtered_sec.empty:
                filtered_sec = products_df[
                    (products_df['category'] == cat) &
                    (products_df['price'] <= budget * 2.0) &
                    (~products_df['product_name'].isin(seen))
                ].copy()
                reason_suffix = "Rekomendasi alternatif"
            
            # Strategy 4: Any product from this category (no budget filter)
            if filtered_sec.empty:
                filtered_sec = products_df[
                    (products_df['category'] == cat) &
                    (~products_df['product_name'].isin(seen))
                ].copy()
                reason_suffix = "Produk populer kategori ini"
            
            if not filtered_sec.empty:
                take = min(1, remaining)  # Take 1 per category for diversity
                top_sec = filtered_sec.sort_values(by=sort_col, ascending=sort_asc).head(take)
                
                for _, row in top_sec.iterrows():
                    recs.append(RecommendationItem(
                        product_id=str(row.get('product_id') or ''),
                        product_name=str(row['product_name']),
                        category=str(row['category']),
                        price=float(row['price']),
                        duration_days=int(row['duration_days']),
                        reasons=[f"Rekomendasi Sekunder: {cat}", reason_suffix]
                    ))
                    seen.add(row['product_name'])
                    remaining -= 1

    # FASE 3: Fallback - Fill remaining slots with any available products
    if len(recs) < total_recommendations:
        remaining = total_recommendations - len(recs)
        fallback_products = products_df[
            ~products_df['product_name'].isin(seen)
        ].copy()
        
        # Sort by popularity (price ascending for best value)
        fallback_products = fallback_products.sort_values(by='price', ascending=True).head(remaining)
        
        for _, row in fallback_products.iterrows():
            recs.append(RecommendationItem(
                product_id=str(row.get('product_id') or ''),
                product_name=str(row['product_name']),
                category=str(row['category']),
                price=float(row['price']),
                duration_days=int(row['duration_days']),
                reasons=["Rekomendasi Umum", "Best value produk populer"]
            ))
            if len(recs) >= total_recommendations:
                break

    return recs[:total_recommendations]


@app.on_event("startup")
def _startup():
    load_artifacts()


@app.post("/infer/analytic", response_model=AnalyticResponse)
def infer_analytic(payload: AnalyticRequest):
    if clf is None or label_encoder is None or global_averages is None:
        raise HTTPException(status_code=500, detail='Artifacts not loaded')

    customer_row = fetch_customer(payload.customer_id)
    X = prepare_features(customer_row)

    # Predict label
    pred_idx = clf.predict(X)
    pred_label = label_encoder.inverse_transform(pred_idx)[0]
    user_category = TARGET_TO_CATEGORY_MAP.get(pred_label, "Unknown")

    # Churn probability based on "Retention Offer" class
    class_list = list(label_encoder.classes_)
    try:
        idx_ret = class_list.index('Retention Offer')
        proba_all = clf.predict_proba(X)
        churn_proba = float(proba_all[0][idx_ret])
    except Exception:
        churn_proba = 0.0

    churn_label = compute_churn(churn_proba)

    # Products + recommendations
    products_df = fetch_products()
    items = recommend_products(pred_label, X, products_df, payload.top_n or TOP_N_DEFAULT)

    # Generate AI insights if Gemini is available
    ai_insights = None
    if model_llm is not None:
        try:
            product_insight = gemini_user_product_insight(pred_label, customer_row, items)
            churn_insight = gemini_churn_analysis(churn_proba, customer_row, pred_label)
            ai_insights = {
                'product_recommendation': product_insight,
                'churn_analysis': churn_insight
            }
        except Exception as e:
            print(f"Error generating AI insights: {e}")

    return AnalyticResponse(
        recommendations={
            'topN': payload.top_n or TOP_N_DEFAULT,
            'items': [i.model_dump() for i in items],
        },
        churn=ChurnResult(probability=churn_proba, label=churn_label, raw_label=pred_label),
        user_category=user_category,
        generated_at=datetime.now(timezone.utc).isoformat(),
        ai_insights=ai_insights,
    )


@app.get("/health")
def health():
    return {"status": "ok"}
