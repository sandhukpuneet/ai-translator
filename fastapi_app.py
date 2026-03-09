from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app import translate_text


app = FastAPI(title="AI Translator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranslateRequest(BaseModel):
    text: str
    target_language: str = "French"


class TranslateResponse(BaseModel):
    result: str


@app.get("/health")
async def health():
    return {"status": "ok", "message": "AI Translator FastAPI backend is running."}


@app.post("/api/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest) -> TranslateResponse:
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")

    try:
        result = translate_text(text, req.target_language)
    except Exception as exc:  # pragma: no cover - simple error mapping
        # You can log `exc` here if you add logging
        raise HTTPException(
            status_code=500,
            detail="Translation failed. Check server logs for details.",
        ) from exc

    return TranslateResponse(result=result)


frontend_dist = Path(__file__).parent / "frontend" / "dist"

if frontend_dist.exists():
    app.mount(
        "/",
        StaticFiles(directory=str(frontend_dist), html=True),
        name="frontend",
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("fastapi_app:app", host="0.0.0.0", port=8000, reload=True)

