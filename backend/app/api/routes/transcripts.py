from fastapi import APIRouter

from app.models.schemas import SummaryResponse, TranscriptRequest
from app.services.summarizer import TranscriptSummarizerService

router = APIRouter(prefix="/transcripts", tags=["transcripts"])
service = TranscriptSummarizerService()


@router.post("/summarize", response_model=SummaryResponse)
async def summarize_transcript(payload: TranscriptRequest) -> SummaryResponse:
    summary = await service.summarize(payload.transcript)
    return summary
