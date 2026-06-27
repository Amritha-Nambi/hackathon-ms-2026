# Frontend — Sales Call Summary Generator

This is a React + Vite frontend for the Sales Call Summary Generator.

## Quick start

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Backend connection

The frontend sends transcript data to the backend API at:

- default: `POST /transcripts/summarize`
- override with `VITE_API_URL` in `frontend/.env`

Example `.env`:

```bash
VITE_API_URL=http://localhost:8000/transcripts/summarize
```

### Request payload

```json
{
  "transcript": "..."
}
```

### Response

The backend returns structured JSON including summary fields such as:

- `summary`
- `key_points`
- `action_items`
- `sentiment`
- `follow_up_needed`
- `caller_name`
- `phone_number`
- `call_date`

## Notes

- The frontend does not call the AI provider directly.
- Keep API keys and provider configuration in the backend only.
- This app is designed to connect to the local FastAPI backend in `backend/`.
