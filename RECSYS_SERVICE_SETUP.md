# Setup Recsys Agentic Service

## Cara Cepat (Windows)

1. **Jalankan service:**
   ```powershell
   .\run-recsys.bat
   ```

   Script ini akan otomatis:
   - Mengaktifkan virtual environment
   - Install dependencies jika belum
   - Menjalankan uvicorn server

2. **Test service:**
   - Buka browser: http://localhost:8000/docs
   - Atau test endpoint: http://localhost:8000/health

## Setup Manual

### 1. Pastikan `.env.local` sudah ada dengan isi:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

### 2. Aktivasi virtual environment:
```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies (jika belum):
```powershell
pip install -r src\services\recsys_agentic\requirements.txt
```

### 4. Jalankan service:
```powershell
uvicorn src.services.recsys_agentic.main:app --host 0.0.0.0 --port 8000 --reload
```

## Troubleshooting

### Error: "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set"
**Solusi:**
- Pastikan file `.env.local` ada di root project
- Isi dengan credentials Supabase yang benar
- Restart service setelah mengubah `.env.local`

### Error: "Model artifacts not found"
**Solusi:**
- Pastikan folder `src/services/model/` ada
- Harus berisi file: `clf_model.pkl`, `label_encoder.pkl`, `global_averages.pkl`

### Error: "Customer not found"
**Solusi:**
- Pastikan customer_id ada di tabel `customer_profile` di Supabase
- Coba dengan customer_id yang valid dari database

### Service berjalan tapi tidak ada AI insights
**Solusi:**
- Tambahkan `GEMINI_API_KEY` di `.env.local`
- Dapatkan API key dari: https://makersuite.google.com/app/apikey

## API Endpoints

### POST /infer/analytic
Request:
```json
{
  "customer_id": "C00001",
  "top_n": 5
}
```

Response:
```json
{
  "recommendations": {
    "items": [
      {
        "product_name": "Combo Hemat 15GB + 300Menit",
        "category": "Combo",
        "price": 15666,
        "duration_days": 30,
        "reasons": ["..."]
      }
    ]
  },
  "churn": {
    "probability": 0.05,
    "label": "low",
    "raw_label": "General Offer"
  },
  "user_category": "General Offer",
  "ai_insights": {
    "product_recommendation": "...",
    "churn_analysis": "..."
  }
}
```

### GET /health
Response:
```json
{
  "status": "ok"
}
```
