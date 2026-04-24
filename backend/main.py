from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio

from services.transcript import extract_video_id, get_transcript
from services.chunker import chunk_transcript
from services.embedder import embed_and_store
from services.retriever import retrieve_relevant_chunks
from services.llm import generate_answer

app = FastAPI()


class SummarizeRequest(BaseModel):
    url: str


class AskRequest(BaseModel):
    url: str
    question: str


@app.get("/")
def root():
    return {"message": "VideoRAG API running"}


@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    try:
        video_id = extract_video_id(req.url)
        transcript = get_transcript(video_id)
        chunks = chunk_transcript(transcript)

        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(
            None, embed_and_store, video_id, chunks
        )

        return {
            "video_id": video_id,
            "num_segments": len(transcript),
            "num_chunks": len(chunks),
            "embedding_status": result
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/ask")
def ask(req: AskRequest):
    try:
        video_id = extract_video_id(req.url)

        retrieved_chunks = retrieve_relevant_chunks(
            video_id=video_id,
            question=req.question
        )

        final_answer = generate_answer(
            question=req.question,
            retrieved_chunks=retrieved_chunks
        )

        return {
            "video_id": video_id,
            "question": req.question,
            "answer": final_answer,
            "sources": [
                {
                    "start_time": chunk["start_time"],
                    "end_time": chunk["end_time"],
                    "sentences": chunk["sentences"],
                    "score": chunk["score"]
                }
                for chunk in retrieved_chunks
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))