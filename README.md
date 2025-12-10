# Telvora

Sebuah web-based system yang dirancang untuk mendukung analitik pelanggan, simulasi produk, dan rekomendasi layanan pada sektor telekomunikasi. Sistem ini terdiri dari public landing page dan admin panel untuk pengelolaan data serta konfigurasi model.

### 🔍 Fitur Utama

**1. Landing Page Publik** 
- Menyajikan informasi umum, preview fitur, serta akses awal bagi pengguna atau klien.

**2. Admin Panel**
- Manajemen data pelanggan
- Pengelolaan katalog produk dan parameter simulasi
- Konfigurasi modul rekomendasi
- Dashboard analitik untuk visualisasi insight

### 🎯 Tujuan Sistem

Memberikan solusi end-to-end untuk industri telekomunikasi dalam:
   - Menganalisis perilaku dan segmentasi pelanggan
   - Mensimulasikan performa atau penawaran produk
   - Memberikan rekomendasi layanan berbasis data
   - Mendukung keputusan bisnis secara lebih akurat dan efisien

### Prerequisites
- **Node.js** v16+ (untuk frontend)
- **Python** 3.8+ (untuk backend)
- **Git**
- **Supabase account** (free tier cukup)

### Step 1: Clone Repository

```bash
git clone https://github.com/Hazyrzq/Telvora.git
cd Telvora
```

### Step 2: Setup Frontend

```bash
# Install dependencies
npm install
```

### Step 3: Setup Backend

```bash
# Buat virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 4: Konfigurasi Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase Configuration

# Ollama/LLM Configuration (untuk AI insights)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```
# Backend FastAPI (Railway)
VITE_RECSYS_URL=https://your-recsys-api-url

# Ollama/LLM Configuration (untuk AI insights)
OLLAMA_BASE_URL=http://localhost:11434 # gunakan https://ollama.com untuk cloud
OLLAMA_MODEL=mistral # atau model lain yang tersedia
OLLAMA_API_KEY=  # Leave empty untuk local, set untuk Ollama Cloud
**Mendapatkan Supabase credentials:**
1. Login ke [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Settings** → **API**
4. Copy `Project URL` dan `anon (public)` key
### Step 5: Database Setup


Model file yang diperlukan harus tersedia di `src/services/model/`:
- `model_dokter_rf.pkl` - Trained Random Forest model
- `label_encoder.pkl` - Category label encoder
- `global_averages.pkl` - Global feature averages

(Hubungi tim development untuk file ini atau train ulang dengan notebook)

### Step 7: Setup Ollama (Optional - untuk AI Insights)

```bash
# Install Ollama dari https://ollama.ai
# Jalankan:
ollama serve

# Di terminal lain, pull model:
ollama pull mistral  # atau model pilihan lain

# Ollama akan berjalan di http://localhost:11434
```

**Alternative:** Gunakan Ollama Cloud
- Daftar di https://ollama.com
- Set `OLLAMA_API_KEY` dan `OLLAMA_BASE_URL=https://ollama.com` di `.env.local`

### Step 8: Jalankan Aplikasi

**Terminal 1 - Backend (FastAPI)**
```bash
# Pastikan di root project dengan venv activated
uvicorn src.services.recsys_agentic.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend (Vite dev server)**
```bash
npm run dev
# Atau: Double-click run-dev.bat (Windows)
```

**Expected Output:**
```
Frontend: http://localhost:5173 atau 5174
Backend:  http://localhost:8000
API Docs: http://localhost:8000/docs (Swagger UI)
```

---

## 📖 Panduan Penggunaan

### 1. **Akses Landing Page**
```
URL: http://localhost:5173
```
- Jelajahi fitur platform
- Klik "Masuk" atau "Login" untuk akses admin

### 2. **Login ke Admin Panel**
```
URL: http://localhost:5173/login
```
- Gunakan email/password yang terdaftar di Supabase
- Setelah login, akan di-redirect ke `/admin`

### 3. **Dashboard Overview**
```
URL: http://localhost:5173/admin
```
- Lihat statistik ringkas (total customer, churn rate, etc.)
- Quick access ke semua fitur admin

### 4. **Kelola Paket Produk**
```
URL: http://localhost:5173/admin/packages
```
**Workflow:**
1. Lihat daftar semua produk dengan kategori
2. Filter berdasarkan kategori atau harga
3. Click pada produk untuk lihat detail:
   - Kapasitas (GB, minutes, SMS)
   - Harga & durasi
   - Target customer segment
4. View analytics penetrasi per kategori

### 5. **Analisis Pelanggan**
```
URL: http://localhost:5173/admin/customers
```
**Workflow:**
1. Lihat 10,000+ customer records
2. View complete customer profile:
   - Segment & lokasi
   - Usage pattern (data, voice, video, SMS)
   - Monthly spend & top-up frequency
   - Travel score & complaints
3. Search customer by ID atau kriteria lain
4. Click customer untuk detail view
5. Export data untuk analisis external

### 6. **Product Lab - Simulasi Produk Baru** ⭐
```
URL: http://localhost:5173/admin/product-lab
```
**Workflow:**
1. Isi form konfigurasi produk baru:
   ```
   - Product Name: e.g., "Data Booster 50GB"
   - Category: Pilih dari 9 kategori
   - Price: Set harga Rp
   - Duration: Hari / bulan
   ```
2. Click "Simulate" untuk analisis dampak
3. Lihat hasil:
   - **Hits**: Jumlah customer yang match
   - **Conversion Rate**: % dari total customer
   - **Revenue Potential**: Proyeksi revenue
   - **Segment Breakdown**: Customer per segment
   - **AI Recommendation**: Apakah produk layak diproduksi
4. Repeat dengan parameter berbeda untuk A/B testing

**Contoh Use Case:**
```
Simulasi: Data Booster dengan harga Rp 50,000
Result: 1,200 target customer, 12% conversion, Rp 60,000,000 revenue
AI Insight: "Potensi TINGGI - sangat recommended untuk produksi"
```

### 7. **AI-Powered Recommendations**
```
URL: http://localhost:5173/admin/recommendations
```
**Workflow:**
1. Masukkan Customer ID
2. Sistem akan:
   - Prediksi kategori kebutuhan customer
   - Generate top-5 rekomendasi produk
   - Rank berdasarkan budget & usage pattern
3. Lihat AI Insights:
   - **Product Insight**: Kenapa produk ini cocok + tips marketing
   - **Churn Analysis**: Risk level & retention strategy
   - **Personalized Message**: Template komunikasi ke customer

**Contoh Output:**
```
Customer ID: CUST_001
Segment: "High-Value Data Consumer"
Top Recommendations:
1. Data Booster 100GB - Rp 150,000 ⭐⭐⭐
2. Unlimited Streaming - Rp 120,000 ⭐⭐
3. Family Plan - Rp 200,000 ⭐

Churn Risk: MEDIUM
AI Insight: "Customer ini heavy data user dengan complaint history. 
Rekomendasikan Data Booster dengan incentive bundle untuk retensi..."
```

### 8. **Tentang Sistem**
```
URL: http://localhost:5173/tentang-sistem
```
- Dokumentasi lengkap fitur & cara kerja
- FAQ & troubleshooting
- Kontakt support

---

## 🔍 API Endpoints

### Health Check
```
GET http://localhost:8000/health
Response: {"status": "ok"}
```

### Analytic Inference
```
POST http://localhost:8000/infer/analytic
Body: {
  "customer_id": "CUST_001",
  "top_n": 5
}
Response: {
  "recommendations": {...},
  "churn": {...},
  "user_category": "...",
  "ai_insights": {...}
}
```

### Product Simulation
```
POST http://localhost:8000/infer/simulate-product
Body: {
  "product_name": "Data Booster 50GB",
  "category": "Data",
  "price": 50000,
  "duration_days": 30
}
Response: {
  "hits": 1200,
  "revenue": 60000000,
  "conversion_rate": 12.0,
  "segments": {...},
  "recommendation": "..."
}
```

### Churn Composition
```
GET http://localhost:8000/analytics/churn-composition
Response: {
  "high": 1500,
  "medium": 3000,
  "low": 5500
}
```

**Full API Documentation:**
```
http://localhost:8000/docs  (Swagger UI)
http://localhost:8000/redoc (ReDoc)
```

## 📁 Struktur Project

```
Telvora/
├── src/
│   ├── components/                    # Reusable React components
│   │   ├── Header.jsx                # Navigation header
│   │   ├── Hero.jsx                  # Landing page hero section
│   │   ├── Features.jsx              # Feature showcase
│   │   ├── AnalyticsHero.jsx        # Analytics page header
│   │   ├── AnalyticsFeatures.jsx    # Analytics features list
│   │   ├── AnalyticsSteps.jsx       # How it works visualization
│   │   ├── Footer.jsx                # Footer component
│   │   ├── AdminLayout.jsx           # Admin dashboard layout wrapper
│   │   ├── ErrorBoundary.jsx        # Error handling
│   │   ├── RequireAuth.jsx          # Auth guard for routes
│   │   └── DatasetPreview.jsx       # Data preview component
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx          # Authentication context & state
│   │
│   ├── layouts/
│   │   └── HomeLayout.jsx           # Public pages layout
│   │
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Login.jsx                # Login/authentication page
│   │   ├── TentangSistem.jsx        # About system page
│   │   └── Admin/                   # Admin dashboard pages (protected)
│   │       ├── Home.jsx             # Dashboard overview
│   │       ├── Product.jsx          # Product management
│   │       ├── ProductLab.jsx       # Product simulation lab
│   │       ├── UserProfile.jsx      # Customer management
│   │       └── Analytic.jsx         # AI recommendations
│   │
│   ├── services/
│   │   ├── api.js                   # Frontend API client
│   │   ├── model/                   # ML model artifacts
│   │   │   ├── model_dokter_rf.pkl          # Random Forest model
│   │   │   ├── label_encoder.pkl            # Category encoder
│   │   │   └── global_averages.pkl          # Feature statistics
│   │   └── recsys_agentic/          # Backend FastAPI service
│   │       ├── main.py              # FastAPI app & ML inference
│   │       └── requirements.txt     # Python dependencies
│   │
│   ├── styles/
│   │   ├── index.css                # Global styles
│   │   ├── App.css                  # App-level styles
│   │   ├── Header.css               # Header component styles
│   │   ├── Footer.css               # Footer styles
│   │   ├── Login.css                # Login page styles
│   │   ├── AnalyticsHero.css       # Analytics section styles
│   │   ├── AnalyticsFeatures.css   # Features styles
│   │   ├── AnalyticsSteps.css      # Steps visualization styles
│   │   └── Admin/                   # Admin pages styling
│   │       ├── AdminLayout.css      # Admin layout styles
│   │       ├── Home.css             # Dashboard styles
│   │       ├── Product.css          # Product list styles
│   │       ├── ProductLab.css       # Simulation lab styles
│   │       ├── UserProfile.css      # Customer list styles
│   │       ├── Analytic.css         # Recommendations styles
│   │       └── DatasetPreview.css  # Preview table styles
│   │
│   ├── App.jsx                      # Main router component
│   └── main.jsx                     # React entry point
│
├── database/
│   └── migrations/
│       ├── 001_create_tables.sql    # Supabase schema & DDL
│       └── 002_create_product_simulations.sql
├── public/
│   ├── config.example.js            # Config template
│   └── [assets]                     # Static assets
│
├── .env.local                       # Environment variables (create this)
├── .env.example                     # Env template
├── index.html                       # HTML entry point
├── package.json                     # Frontend dependencies
├── vite.config.js                   # Vite configuration
├── install.bat                      # Windows install helper
├── run-dev.bat                      # Windows dev server helper
├── requirements.txt                 # Python backend dependencies
├── README.md                        # This file
└── .gitignore                       # Git ignore rules
```

---

## 🎨 Component & Page Reference

### Frontend Components

| Component | Path | Deskripsi |
|-----------|------|-----------|
| Header | `src/components/Header.jsx` | Navigation bar dengan dropdown menu |
| Hero | `src/components/Hero.jsx` | Landing page banner |
| Features | `src/components/Features.jsx` | 6 feature cards |
| Footer | `src/components/Footer.jsx` | Footer dengan links & kontak |
| AdminLayout | `src/components/AdminLayout.jsx` | Admin sidebar + header wrapper |
| ErrorBoundary | `src/components/ErrorBoundary.jsx` | Error fallback component |
| RequireAuth | `src/components/RequireAuth.jsx` | Route protection HOC |
| DatasetPreview | `src/components/DatasetPreview.jsx` | Reusable data table |

### Pages

| Page | Route | Deskripsi |
|------|-------|-----------|
| Home (Landing) | `/` | Public landing page |
| Login | `/login` | Authentication page |
| Tentang Sistem | `/tentang-sistem` | System documentation |
| **Admin Dashboard** | `/admin` | Overview & quick stats |
| **Product Manager** | `/admin/packages` | Product CRUD & analytics |
| **Customer Manager** | `/admin/customers` | Customer list & profiles |
| **Product Lab** | `/admin/product-lab` | Product simulation engine |
| **Recommendations** | `/admin/recommendations` | AI-powered recommendations |

---

## 🔐 Authentication Flow

```
User Visit Landing → Click "Login"
                ↓
         /login page
                ↓
    Email + Password input
                ↓
   Supabase Auth (server)
                ↓
     ✅ Valid → JWT token stored
                ↓
    Redirect → /admin (protected)
                ↓
     ❌ Invalid → Error message
                ↓
    Remain on /login
```

---

## 🤖 Machine Learning Model

### Model Architecture
- **Algorithm**: Random Forest Classifier
- **Classes**: 9 product categories
  1. Data Booster
  2. Voice Bundle
  3. Streaming Partner Pack (VOD)
  4. Family Plan Offer (Combo)
  5. Retention Offer
  6. Top-up Promo
  7. General Offer
  8. Roaming Pass
  9. Device Upgrade Offer

### Input Features (8 features)
```python
[
  'avg_data_usage_gb',      # Average monthly data usage
  'pct_video_usage',         # % of data used for video
  'avg_call_duration',       # Average call duration (minutes)
  'sms_freq',                # SMS frequency per month
  'monthly_spend',           # Monthly spending (Rp)
  'topup_freq',              # Top-up frequency per month
  'travel_score',            # Travel/roaming behavior score
  'complaint_count'          # Total complaints/tickets
]
```

### Training Data
- **Dataset Size**: 10,000+ customer profiles
- **Split**: 80% train, 20% test
- **Feature Engineering**: Normalization, outlier handling
- **Accuracy**: ~95% (evaluated on test set)

### Inference Pipeline
```
Customer Data → Feature Preparation → ML Model → Category Prediction
     ↓                                    ↓              ↓
Profile from             Numeric        Random Forest  9 class
Supabase               Conversion      Classifier      probabilities
                                            ↓
                              Select highest probability
                                    ↓
                           Decode to category name
```

---

## 🔧 Troubleshooting

### Issue: "Cannot reach backend API"
**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000/health

# If not, start backend:
uvicorn src.services.recsys_agentic.main:app --reload
```

### Issue: "ML model not found"
**Solution:**
```
Error: Model artifacts not found in: src/services/model/
- model_dokter_rf.pkl
- label_encoder.pkl
- global_averages.pkl

Solusi: Request model files dari development team
atau train ulang dengan ML notebook
```

### Issue: "Supabase connection error"
**Solution:**
```
1. Verify .env.local has correct credentials:
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   
2. Check Supabase dashboard → Authentication → URL Configuration
   - Whitelist http://localhost:5173
   - Whitelist http://localhost:5174
```

### Issue: "AI insights tidak tersedia"
**Solution:**
```bash
# Option 1: Use Local Ollama
ollama serve
ollama pull mistral

# Option 2: Use Ollama Cloud
# Set in .env.local:
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_API_KEY=your_cloud_api_key
OLLAMA_MODEL=mistral
```

### Issue: "Customer data loading very slow"
**Solution:**
```
- Backend pagination fetches in 1000-row batches
- For 10,000 records: ~10 API calls
- Check network tab in DevTools for bottlenecks
- Consider adding data caching if frequently accessed
```

---

## 📚 Replikasi & Development

### Untuk Developer Baru

1. **Clone & Setup** (lihat section Instalasi di atas)

2. **Understand Architecture**
   - Frontend: React components in `src/`
   - Backend: FastAPI in `src/services/recsys_agentic/main.py`
   - ML: Model inference in `simulate_product_impact()` function

3. **Key Files to Modify**
   - Add new page: `src/pages/Admin/NewPage.jsx` + route in `src/App.jsx`
   - Add API endpoint: Edit `src/services/recsys_agentic/main.py`
   - Update styling: Edit corresponding `src/styles/Admin/*.css`
   - Modify schema: Update `database/migrations/`

4. **Testing Workflow**
   ```bash
   # Terminal 1: Backend
   uvicorn src.services.recsys_agentic.main:app --reload
   
   # Terminal 2: Frontend
   npm run dev
   
   # Terminal 3: Test in browser
   http://localhost:5173
   ```

5. **Deploying Changes**
   - Frontend: Build dengan `npm run build` → deploy static files
   - Backend: Push code → deploy FastAPI service
   - Database: Apply migrations → `database/migrations/`

### Kontribusi Guidelines

- Follow existing code style (React hooks, functional components)
- Add comments untuk complex logic
- Test fitur di dev server sebelum push
- Update README jika ada fitur/API baru
- Use meaningful commit messages

---

## 🚀 Cara Deploy & Integrasi Backend FastAPI di Railway

1. **Deploy Backend ke Railway**
   - https://github.com/devilk1d/telvora-model-service (Push kode backend ke GitHub) 
   - Buat project baru di Railway, hubungkan ke repository backend Anda.
   - Railway akan otomatis build dan deploy backend FastAPI.

2. **Generate Public URL**
   - Setelah deploy, klik tombol "Generate Domain" di dashboard Railway.
   - Railway akan memberikan public URL (misal: https://your-service.up.railway.app).

3. **Integrasi dengan Frontend**
   - Copy public URL Railway.
   - Masukkan ke environment variable frontend (misal: VITE_RECSYS_URL).
   - Frontend dapat mengakses API backend melalui URL tersebut.

4. **Monitoring & Logs**
   - Railway menyediakan dashboard untuk melihat status service, logs, dan error.

Ringkasnya: Railway memudahkan deploy backend, generate public URL, dan integrasi dengan frontend tanpa perlu setup server manual.

---

**Last Updated**: December 2025
**Version**: 1.0.0
