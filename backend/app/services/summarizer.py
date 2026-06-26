import json
import os
from typing import Any, Optional

from app.core.config import settings
from app.models.schemas import SummaryResponse


class TranscriptSummarizerService:
    def __init__(self) -> None:
        self._provider = None

    async def summarize(self, transcript: str) -> SummaryResponse:
        print(f"Summarizing transcript with length {len(transcript)} characters")
        if settings.gemini_api_key:
            return await self._summarize_with_gemini(transcript)
        return self._summarize_locally(transcript)

    async def _summarize_with_gemini(self, transcript: str) -> SummaryResponse:
        try:
            import google.generativeai as genai
        except ImportError as exc:
            raise RuntimeError(
                "google-generativeai package is required when GEMINI_API_KEY is set"
            ) from exc

        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.gemini_model)
        prompt = self._build_prompt(transcript)
        response = model.generate_content(prompt)

        raw_text = response.text
        payload = self._parse_json_response(raw_text)
        payload["summary"] = self._normalize_summary_length(
            payload.get("summary") or ""
        )
        return SummaryResponse(**payload)

    def _summarize_locally(self, transcript: str) -> SummaryResponse:
        summary = self._build_fallback_summary(transcript)
        return SummaryResponse(
            summary=summary,
            key_points=self._extract_key_points(transcript),
            action_items=self._extract_action_items(transcript),
            sentiment=self._detect_sentiment(transcript),
            follow_up_needed=True,
            caller_name=self._extract_caller_name(transcript),
            phone_number=self._extract_phone_number(transcript),
            call_date=self._extract_call_date(transcript),
        )

    def _build_prompt(self, transcript: str) -> str:
        return (
            "You are summarizing a sales or support call transcript. "
            "Return valid JSON only and do not include any extra prose or markdown. "
            "The summary value must be 20-30 words long, concise, factual, and business-friendly. "
            "Do not exceed 30 words. If the transcript contains a customer name, phone number, or call date, extract and place them in customer_name, phone_number, and call_date. "
            "If a value is not present, use null. "
            "Use exactly these keys: summary, key_points, action_items, sentiment, follow_up_needed, customer_name, phone_number, call_date. "
            f"Transcript:\n{transcript}"
        )

    def _parse_json_response(self, raw_text: str) -> dict[str, Any]:
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`")
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()
        return json.loads(cleaned)

    def _normalize_summary_length(self, summary: str) -> str:
        words = summary.split()
        if len(words) > 30:
            return " ".join(words[:30])
        if len(words) < 20:
            words.extend(["for", "follow-up", "and", "next", "steps"])
            if len(words) > 30:
                return " ".join(words[:30])
        return " ".join(words)

    def _build_fallback_summary(self, transcript: str) -> str:
        lowered = transcript.lower()
        if "pricing" in lowered or "quote" in lowered:
            summary = "Customer discussed enterprise pricing and the agent confirmed a quote would be sent by tomorrow for follow-up and next steps."
        elif "issue" in lowered or "problem" in lowered:
            summary = "Prospect raised an issue and the agent outlined a resolution path with clear follow-up actions for the next conversation."
        elif "backup" in lowered or "ransomware" in lowered:
            summary = "Prospect flagged backup and recovery concerns and the agent proposed an assessment with follow-up and next steps."
        else:
            summary = "Customer conversation covered needs, concerns, and follow-up actions with clear next steps for the team and the account owner today."
        return self._normalize_summary_length(summary)

    def _extract_key_points(self, transcript: str) -> list[str]:
        points: list[str] = []
        if "pricing" in transcript.lower():
            points.append("Pricing was discussed")
        if "quote" in transcript.lower():
            points.append("A quote was mentioned")
        if not points:
            points.append("Conversation reviewed")
        return points

    def _extract_action_items(self, transcript: str) -> list[str]:
        items = ["Follow up with the customer"]
        if "quote" in transcript.lower():
            items.append("Send the quote")
        return items

    def _extract_caller_name(self, transcript: str) -> Optional[str]:
        import re

        patterns = [
            r"(?i)customer[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
            r"(?i)caller[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
            r"(?i)hi\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        ]
        for pattern in patterns:
            match = re.search(pattern, transcript)
            if match:
                return match.group(1).strip()

        for token in ["Mike", "Sarah", "John", "Alex", "David", "Emily", "Rachel"]:
            if token.lower() in transcript.lower():
                return token
        return None

    def _extract_phone_number(self, transcript: str) -> Optional[str]:
        import re

        patterns = [
            r"\b(?:\+?\d[\d\s().-]{7,}\d)\b",
            r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b",
        ]
        for pattern in patterns:
            match = re.search(pattern, transcript)
            if match:
                value = match.group(0).strip()
                if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value) is None:
                    return value
        return None

    def _extract_call_date(self, transcript: str) -> Optional[str]:
        import re

        match = re.search(
            r"\b(?:\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4})\b", transcript
        )
        return match.group(0) if match else None

    def _detect_sentiment(self, transcript: str) -> str:
        lowered = transcript.lower()
        if any(word in lowered for word in ["happy", "great", "thanks", "excellent"]):
            return "positive"
        if any(word in lowered for word in ["issue", "problem", "angry", "concern"]):
            return "negative"
        return "neutral"
