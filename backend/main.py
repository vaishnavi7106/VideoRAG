from fastapi import FastAPI, HTTPException
from services.transcript import extract_video_id, get_transcript
from services.chunker import chunk_transcript

app = FastAPI()


@app.get("/")
def root():
    return {"message": "VideoRAG API running"}


@app.post("/summarize")
def summarize(url: str):
    try:
        video_id = extract_video_id(url)
        transcript = get_transcript(video_id)

        chunks = chunk_transcript(transcript)

        return {
            "video_id": video_id,
            "num_segments": len(transcript),
            "num_chunks": len(chunks),
            "sample_chunk": chunks[0]
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))