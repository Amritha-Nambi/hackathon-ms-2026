# Sales Call Summary Generator

This repository contains a React frontend and FastAPI backend for a Sales Call Summary Generator.

## Project structure

- `frontend/` — React + Vite frontend application
- `backend/` — FastAPI backend service that summarizes transcripts using an AI model
- `resources/` — design and documentation artifacts

## Frontend

The frontend lives in `frontend/` and is built with React and Vite.

Quick start:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

The frontend sends a transcript to the backend at:

- default: `POST /transcripts/summarize`
- override with `.env` using `VITE_API_URL`

Request payload:

```json
{
  "transcript": "..."
}
```

## Backend

The backend lives in `backend/` and is built with FastAPI.

Quick start:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend exposes:

- `GET /health`
- `POST /transcripts/summarize`

`POST /transcripts/summarize` accepts a transcript and returns a structured summary response. The backend uses `GEMINI_API_KEY` to connect to Google Gemini if configured.

## API contract

Request body:

```json
{
  "transcript": "Sales call transcript text..."
}
```

Response includes fields such as:

- `summary`
- `key_points`
- `action_items`
- `sentiment`
- `follow_up_needed`
- `caller_name`
- `phone_number`
- `call_date`

## Notes

- The frontend does not store API keys or call the AI provider directly.
- Keep your provider credentials in the backend environment.
- Use `VITE_API_URL` in `frontend/.env` to point the frontend to a deployed backend if needed.
