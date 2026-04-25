import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio

from services.transcript import extract_video_id, get_transcript
from services.chunker import chunk_transcript
from services.embedder import embed_and_store
from services.retriever import retrieve_relevant_chunks, retrieve_comparison_chunks
from services.llm import generate_answer, generate_comparison_answer
from services.summarizer import generate_video_summary
from services.video_info import get_video_info

app = FastAPI()

# load allowed origins from env — never hardcode in production
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SummarizeRequest(BaseModel):
    url: str
    summary_mode: str = "concise"  # "concise" or "detailed"


class AskRequest(BaseModel):
    urls: list[str]
    question: str
    answer_mode: str = "concise"  # "concise" or "detailed"


@app.get("/")
def root():
    return {"message": "VideoRAG API running"}


@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    try:
        if req.summary_mode not in ("concise", "detailed"):
            raise HTTPException(
                status_code=400,
                detail="summary_mode must be 'concise' or 'detailed'"
            )

        video_id = extract_video_id(req.url)
        video_info = get_video_info(req.url)
        transcript = get_transcript(video_id)
        chunks = chunk_transcript(transcript)

        loop = asyncio.get_running_loop()
        embedding_result = await loop.run_in_executor(
            None, embed_and_store, video_id, chunks
        )

        summary_result = generate_video_summary(chunks, mode=req.summary_mode)

        return {
            "video_id": video_id,
            "video_title": video_info["title"],
            "thumbnail": video_info["thumbnail"],
            "num_segments": len(transcript),
            "num_chunks": len(chunks),
            "embedding_status": embedding_result,
            "summary_mode": req.summary_mode,
            "summary": summary_result.get("summary", ""),
            "key_sections": summary_result.get("key_sections", [])
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/ask")
def ask(req: AskRequest):
    try:
        if not req.urls:
            raise HTTPException(
                status_code=400,
                detail="At least one URL is required."
            )

        if req.answer_mode not in ("concise", "detailed"):
            raise HTTPException(
                status_code=400,
                detail="answer_mode must be 'concise' or 'detailed'"
            )

        video_ids = [extract_video_id(url) for url in req.urls]

        # single video — Q&A mode
        if len(video_ids) == 1:
            video_info = get_video_info(req.urls[0])
            retrieved_chunks = retrieve_relevant_chunks(
                video_id=video_ids[0],
                question=req.question
            )

            if not retrieved_chunks:
                raise HTTPException(
                    status_code=400,
                    detail="No embeddings found for this video. Please summarize it first."
                )

            final_answer = generate_answer(
                question=req.question,
                retrieved_chunks=retrieved_chunks,
                answer_mode=req.answer_mode
            )

            return {
                "mode": "single_video",
                "answer_mode": req.answer_mode,
                "video_id": video_ids[0],
                "video_title": video_info["title"],
                "thumbnail": video_info["thumbnail"],
                "question": req.question,
                "answer": final_answer,
                "sources": [
                    {
                        "video_label": video_info["title"],
                        "video_id": video_ids[0],
                        "start_time": chunk["start_time"],
                        "end_time": chunk["end_time"],
                        "sentences": chunk["sentences"],
                        "score": chunk["score"]
                    }
                    for chunk in retrieved_chunks
                ]
            }

        # multi-video — comparison mode
        video_infos = [get_video_info(url) for url in req.urls]

        all_chunks = []
        missing_videos = []

        for url, video_info in zip(req.urls, video_infos):
            video_id = extract_video_id(url)
            chunks = retrieve_comparison_chunks(
                video_id=video_id,
                question=req.question
            )

            if not chunks:
                missing_videos.append(video_info["title"])
                continue

            for chunk in chunks:
                chunk["video_id"] = video_id
                chunk["video_label"] = video_info["title"]
                chunk["thumbnail"] = video_info["thumbnail"]

            all_chunks.extend(chunks)

        if not all_chunks:
            raise HTTPException(
                status_code=400,
                detail="No embeddings found for any of these videos. Please summarize them first."
            )

        final_answer = generate_comparison_answer(
            question=req.question,
            retrieved_chunks=all_chunks,
            answer_mode=req.answer_mode
        )

        response = {
            "mode": "multi_video_comparison",
            "answer_mode": req.answer_mode,
            "question": req.question,
            "answer": final_answer,
            "videos_analyzed": len(req.urls) - len(missing_videos),
            "sources": [
                {
                    "video_label": chunk["video_label"],
                    "video_id": chunk["video_id"],
                    "thumbnail": chunk["thumbnail"],
                    "start_time": chunk["start_time"],
                    "end_time": chunk["end_time"],
                    "sentences": chunk["sentences"],
                    "score": chunk["score"]
                }
                for chunk in all_chunks
            ]
        }

        if missing_videos:
            response["warning"] = (
                f"No embeddings found for: {', '.join(missing_videos)}. "
                f"Summarize them first."
            )

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))