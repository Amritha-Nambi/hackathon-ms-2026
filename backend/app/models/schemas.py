from typing import Optional

from pydantic import BaseModel, Field


class TranscriptRequest(BaseModel):
    transcript: str = Field(..., min_length=1, description="Raw call transcript text")
    customer_name: Optional[str] = Field(None, description="Optional customer name")
    call_id: Optional[str] = Field(
        None, description="Optional external call identifier"
    )


class SummaryResponse(BaseModel):
    summary: str
    key_points: list[str]
    action_items: list[str]
    sentiment: str
    follow_up_needed: bool
    caller_name: Optional[str] = None
    phone_number: Optional[str] = None
    call_date: Optional[str] = None
