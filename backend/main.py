import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio

from services.transcript import extract_video_id, get_transcript
from services.chunker import chunk_transcript
from services.embedder import embed_and_store
from services.retriever import (
    retrieve_relevant_chunks,
    retrieve_comparison_chunks,
    search_transcript
)
from services.llm import (
    generate_answer,
    generate_comparison_answer,
    generate_session_title,
    explain_search_result
)
from services.summarizer import generate_video_summary, generate_worth_watching
from services.video_info import get_video_info
from services.study_mode import build_study_set

app = FastAPI()

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
    summary_mode: str = "concise"

class AskRequest(BaseModel):
    urls: list[str]
    question: str
    answer_mode: str = "concise"
    conversation_history: Optional[list] = []

class SearchRequest(BaseModel):
    url: str
    query: str
    top_k: int = 8

class SearchExplainRequest(BaseModel):
    query: str
    chunk_text: str
    start_time: float
    end_time: float

class StudyModeRequest(BaseModel):
    url: str

class SessionTitleRequest(BaseModel):
    first_question: str
    video_titles: list[str] = []

class TranscriptRequest(BaseModel):
    url: str


def resolve_followup_question(question: str, conversation_history: list) -> str:
    question = question.strip()
    if not conversation_history:
        return question
    short_followups = {
        "why", "why?", "how", "how?", "which one", "which one?",
        "what about that", "explain", "more", "more?", "elaborate"
    }
    normalized = question.lower()
    if normalized in short_followups or len(question.split()) <= 3:
        last_user_questions = [
            t.get("content", "")
            for t in reversed(conversation_history)
            if t.get("role") == "user"
        ]
        if last_user_questions:
            return f"{question} (regarding: {last_user_questions[0]})"
    return question


def friendly_error(e: Exception) -> str:
    msg = str(e).lower()
    if "transcript" in msg or "captions" in msg:
        return str(e)
    if "private" in msg or "age" in msg:
        return "Try a different video."
    if "invalid youtube" in msg:
        return "That doesn't look like a valid YouTube URL."
    if "no embeddings" in msg or "summarize" in msg:
        return "Please summarize this video first before asking questions."
    if "connection" in msg or "timeout" in msg:
        return "Connection error. Check your internet and try again."
    if "groq" in msg or "llm" in msg or "model" in msg:
        return "AI service temporarily unavailable. Try again in a moment."
    return "Something went wrong. Please try again."


@app.get("/")
def root():
    return {"message": "VideoRAG API running"}


@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    try:
        if req.summary_mode not in ("concise", "detailed"):
            raise HTTPException(status_code=400, detail="summary_mode must be 'concise' or 'detailed'")

        video_id = extract_video_id(req.url)
        video_info = get_video_info(req.url)
        transcript = get_transcript(video_id)
        chunks = chunk_transcript(transcript)

        loop = asyncio.get_running_loop()
        embedding_result = await loop.run_in_executor(None, embed_and_store, video_id, chunks)

        worth_watching = generate_worth_watching(chunks, video_info["title"])
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
            "key_sections": summary_result.get("key_sections", []),
            "worth_watching": worth_watching
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=friendly_error(e))


@app.post("/ask")
def ask(req: AskRequest):
    try:
        if not req.urls:
            raise HTTPException(status_code=400, detail="At least one URL is required.")
        if req.answer_mode not in ("concise", "detailed"):
            raise HTTPException(status_code=400, detail="answer_mode must be 'concise' or 'detailed'")

        video_ids = [extract_video_id(url) for url in req.urls]
        conversation_history = req.conversation_history or []
        resolved_question = resolve_followup_question(req.question, conversation_history)

        if len(video_ids) == 1:
            video_info = get_video_info(req.urls[0])
            retrieved_chunks = retrieve_relevant_chunks(
                video_id=video_ids[0],
                question=resolved_question
            )
            if not retrieved_chunks:
                raise HTTPException(status_code=400, detail="No embeddings found. Please summarize this video first.")

            final_answer = generate_answer(
                question=resolved_question,
                retrieved_chunks=retrieved_chunks,
                answer_mode=req.answer_mode,
                conversation_history=conversation_history
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
                        "thumbnail": video_info["thumbnail"],
                        "start_time": chunk["start_time"],
                        "end_time": chunk["end_time"],
                        "sentences": chunk["sentences"],
                        "score": chunk["score"]
                    }
                    for chunk in retrieved_chunks
                ]
            }

        video_infos = [get_video_info(url) for url in req.urls]
        all_chunks = []
        missing_videos = []

        for url, video_info in zip(req.urls, video_infos):
            video_id = extract_video_id(url)
            chunks = retrieve_comparison_chunks(video_id=video_id, question=resolved_question)
            if not chunks:
                missing_videos.append(video_info["title"])
                continue
            for chunk in chunks:
                chunk["video_id"] = video_id
                chunk["video_label"] = video_info["title"]
                chunk["thumbnail"] = video_info["thumbnail"]
            all_chunks.extend(chunks)

        if not all_chunks:
            raise HTTPException(status_code=400, detail="No embeddings found. Please summarize the videos first.")

        final_answer = generate_comparison_answer(
            question=resolved_question,
            retrieved_chunks=all_chunks,
            answer_mode=req.answer_mode,
            conversation_history=conversation_history
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
            response["warning"] = f"No embeddings found for: {', '.join(missing_videos)}."

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=friendly_error(e))


@app.post("/search")
async def search_video(req: SearchRequest):
    try:
        if not req.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty.")

        video_id = extract_video_id(req.url)
        hits = search_transcript(video_id=video_id, query=req.query, top_k=req.top_k)

        if not hits:
            raise HTTPException(status_code=400, detail="No embeddings found. Please summarize this video first.")

        return {
            "mode": "semantic_search",
            "query": req.query,
            "results": hits
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=friendly_error(e))


@app.post("/search-explain")
async def search_explain(req: SearchExplainRequest):
    """
    Given a raw transcript chunk from search results,
    generates a clean 1-sentence explanation of what happens at that moment.
    """
    try:
        explanation = explain_search_result(
            query=req.query,
            chunk_text=req.chunk_text,
            start_time=req.start_time,
            end_time=req.end_time
        )
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=400, detail=friendly_error(e))


@app.post("/study")
async def study_mode(req: StudyModeRequest):
    try:
        video_id = extract_video_id(req.url)
        video_info = get_video_info(req.url)

        chunks = retrieve_relevant_chunks(
            video_id=video_id,
            question="overall concepts and main topics in this video",
            top_k=8
        )

        if not chunks:
            raise HTTPException(status_code=400, detail="No embeddings found. Please summarize this video first.")

        result = build_study_set(
            video_id=video_id,
            video_title=video_info["title"],
            chunks=chunks
        )
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=friendly_error(e))


@app.post("/generate-title")
async def generate_title(req: SessionTitleRequest):
    try:
        title = generate_session_title(req.first_question, req.video_titles)
        return {"title": title}
    except Exception:
        return {"title": req.first_question[:40]}


@app.post("/transcript")
async def get_transcript_download(req: TranscriptRequest):
    """
    Returns the full transcript as plain text, formatted with timestamps.
    Frontend downloads this as a .txt file.
    """
    try:
        video_id = extract_video_id(req.url)
        video_info = get_video_info(req.url)
        transcript = get_transcript(video_id)

        lines = [f"Transcript: {video_info['title']}\n"]
        lines.append("=" * 60 + "\n\n")

        for segment in transcript:
            start = segment["start"]
            minutes = int(start // 60)
            seconds = int(start % 60)
            timestamp = f"[{minutes:02d}:{seconds:02d}]"
            lines.append(f"{timestamp} {segment['text']}\n")

        full_text = "".join(lines)

        return {
            "video_id": video_id,
            "video_title": video_info["title"],
            "transcript_text": full_text,
            "segment_count": len(transcript)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=friendly_error(e))