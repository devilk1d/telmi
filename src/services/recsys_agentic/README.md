# Telvora Inference Service (FastAPI)

## Setup (Windows PowerShell)

### 1. Create and activate virtual environment
```powershell
python -m venv .venv.\.venv\Scripts\Activate.ps1
```

### 2. Install dependencies
```powershell
pip install -r src\services\recsys_agentic\requirements.txt
pip install "git+https://github.com/supabase-community/supabase-py.git@v1.0.5"
```

### 3. Set environment variables
Create a `.env.local` file in the project root with:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

Or set them directly in PowerShell:
```powershell
$env:VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="your-anon-key-here"
$env:GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Run the service
```powershell
uvicorn src.services.recsys_agentic.main:app --host 0.0.0.0 --port 8000 --reload
```

## Endpoints
- `POST /infer/analytic` - Get product recommendations and churn analysis
  - Request body: `{ "customer_id": "C00001", "top_n": 5 }`
  - Returns: recommendations, churn risk, AI insights
- `GET /health` - Health check

## Notes
- Model artifacts must exist in `src/services/model/`
- AI insights require `GEMINI_API_KEY` to be set
- Database features require valid Supabase credentials
