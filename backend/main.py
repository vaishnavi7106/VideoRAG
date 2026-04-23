from fastapi import FastAPI, HTTPException
from services.transcript import extract_video_id, get_transcript

app = FastAPI()


@app.get("/")
def root():
    return {"message": "VideoRAG API running"}


@app.post("/summarize")
def summarize(url: str):
    try:
        video_id = extract_video_id(url)
        transcript = get_transcript(video_id)

        return {
        "video_id": video_id,
        "num_segments": len(transcript),
        "preview": transcript[:5],
        "last_segment": transcript[-1]
}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))