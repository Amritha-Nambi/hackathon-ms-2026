# Frontend — Sales Call Summary Generator

This is a minimal React + Vite frontend for the Sales Call Summary Generator.

Quick start

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173).

Notes
- The frontend posts the transcript to an API endpoint configured via `VITE_API_URL` (defaults to `/api/summarize`).
- For production, run a backend proxy that stores the Anthropic API key and exposes a secure `/api/summarize` endpoint.
- The app intentionally does not persist transcripts or output. The sample transcript is preloaded from the test case for convenience.

Environment
- To point the frontend to a different backend, create a `.env` file with:

```
VITE_API_URL=https://your-backend.example.com/api/summarize
```

Security
- Do NOT put API keys in client-side code. Use a server-side proxy.
