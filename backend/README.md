# Call Summary Backend

## Architecture

- `app/main.py`: FastAPI entrypoint
- `app/api/routes`: HTTP endpoints
- `app/models/schemas.py`: request/response models
- `app/services`: business logic and AI integrations
- `app/core/config.py`: environment configuration

## Run locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment

Set your Gemini API key in the environment to enable provider access:

```bash
export GEMINI_API_KEY="your_api_key_here"
```

## API

### GET /health

Returns a simple health check.

### POST /transcripts/summarize

Request body:

```json
{
  "transcript": "Sales call transcript text..."
}
```

Response body includes:

- `summary`
- `key_points`
- `action_items`
- `sentiment`
- `follow_up_needed`
- `caller_name`
- `phone_number`
- `call_date`

The frontend sends transcripts to this endpoint and receives a structured summary response.

## Notes

- The backend is the only component that should hold API keys.
- The frontend connects to `POST /transcripts/summarize` rather than calling the provider directly.
