from fastapi import FastAPI

from app.api.routes import transcripts
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend service for summarizing call transcripts",
)

app.include_router(transcripts.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.app_name}
