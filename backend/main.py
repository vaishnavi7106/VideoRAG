from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.transcript import extract_video_id, get_transcript
from services.chunker import chunk_transcript
from services.embedder import embed_and_store

app = FastAPI()


class SummarizeRequest(BaseModel):
    url: str


@app.get("/")
def root():
    return {"message": "VideoRAG API running"}


@app.post("/summarize")
def summarize(req: SummarizeRequest):
    try:
        video_id = extract_video_id(req.url)
        transcript = get_transcript(video_id)

        chunks = chunk_transcript(transcript)

        result = embed_and_store(video_id, chunks)

        return {
            "video_id": video_id,
            "num_segments": len(transcript),
            "num_chunks": len(chunks),
            "embedding_status": result
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))