# Call Summary Backend

## Architecture

- app/main.py: FastAPI entrypoint
- app/api/routes: HTTP endpoints
- app/models/schemas.py: request/response models
- app/services: business logic and AI integrations
- app/core/config.py: environment configuration

## Run locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Endpoints

- GET /health
- POST /transcripts/summarize
