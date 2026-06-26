# Sales Call Summary Generator — Frontend Demo

This repository contains a single-file static frontend demo for the Sales Call Summary Generator: `index.html`.

Quick start
1. Open `index.html` in your browser (double-click or `File -> Open` in browser).
2. The transcript area is pre-filled with a sample transcript from `testing/test_cases/sales_call_summary_test_case.md`.
3. Click **Generate summary**. On first run the page will prompt for an Anthropic API key for demo purposes.

Notes and security
- This demo calls the Anthropic API directly from the browser for convenience. This is insecure for production because API keys in browsers can be exposed.
- For production, implement a server-side proxy that stores the Anthropic API key in environment variables and forwards requests from the frontend.
- The demo does not persist transcript or output data; the API key entered at runtime is not stored by this page.

Anthropic API
- The page uses the `claude-sonnet-4-6` model and sends a system prompt instructing the model to return strict JSON only.
- The model response is parsed for JSON and rendered into three CRM-ready cards.

Files
- `index.html` — single-file frontend
- `README.md` — this file
- `testing/test_cases/sales_call_summary_test_case.md` — sample transcript used as placeholder
- `resources/use_case2_summary_generator_ui_tone.md` — UI tone & color palette

If you want, I can update the frontend to call a local proxy endpoint instead of the Anthropic public endpoint, and provide a minimal Node/Express proxy server that safely stores the API key.
