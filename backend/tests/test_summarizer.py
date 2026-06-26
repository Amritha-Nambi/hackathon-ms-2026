import asyncio
import os

from app.services.summarizer import TranscriptSummarizerService


def test_summarizer_creates_structured_summary_from_transcript(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    os.environ.pop("OPENAI_API_KEY", None)

    service = TranscriptSummarizerService()
    result = asyncio.run(
        service.summarize(
            "Agent: Thanks for calling Acme. Customer: I need pricing for your enterprise plan. "
            "Agent: We can send a quote by tomorrow."
        )
    )

    assert result.summary
    assert 20 <= len(result.summary.split()) <= 30
    assert len(result.key_points) >= 1
    assert len(result.action_items) >= 1
    assert result.sentiment in {"positive", "neutral", "negative"}
    assert result.follow_up_needed is True


def test_summarizer_extracts_caller_metadata_from_transcript():
    service = TranscriptSummarizerService()
    result = service._summarize_locally(
        "Agent: Hi Mike, this is Sarah. Call date: 2026-06-26. Phone: 555-123-4567."
    )

    assert result.caller_name == "Mike"
    assert result.phone_number == "555-123-4567"
    assert result.call_date == "2026-06-26"


def test_prompt_instructs_model_for_short_summary_and_metadata():
    service = TranscriptSummarizerService()
    prompt = service._build_prompt("Agent: Thanks for calling today.")

    assert "20-30 words" in prompt
    assert "caller_name" in prompt
    assert "phone_number" in prompt
    assert "call_date" in prompt
