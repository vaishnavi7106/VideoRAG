# VideoRAG

AI-powered multi-video understanding and retrieval system for extracting insights from YouTube videos through semantic search, summarization, comparison, and study workflows.

🔗 Live Demo: [https://video-rag-five.vercel.app/](https://video-rag-five.vercel.app/)

---

## Overview

VideoRAG enables users to analyze and interact with long-form video content such as lectures, documentaries, podcasts, crime cases, medical discussions, and educational videos.

Instead of manually searching through hours of content, users can upload one or multiple YouTube videos, generate structured summaries, ask contextual questions, compare explanations across videos, and retrieve the exact timestamps where answers appear.

The system combines transcript extraction, semantic chunking, vector retrieval, and LLM-powered reasoning to create an interactive video intelligence workspace.

---

## Project Goal

VideoRAG is designed as an AI-powered decision engine for long-form YouTube content.

It helps users answer questions such as:

* Should I watch this video?
* Which video explains this topic better?
* What part of the video matters most?
* Where exactly was this explained?

The focus is on reducing wasted time and improving trust through source-grounded answers.

---

## Features

* Multi-video comparison and cross-video reasoning
* AI-generated concise and detailed summaries
* Semantic search with timestamp-based retrieval
* Context-aware question answering from video content
* Study mode with quiz generation and learning support
* Session history with persistent workspace tracking
* Transcript generation and downloadable text output
* Clean workspace-based interface for continuous exploration

---

## Tech Stack

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Frontend         | React, Vite, JavaScript                          |
| UI / State       | React Hooks, Local Storage                       |
| Backend          | FastAPI, Python                                  |
| Vector Database  | ChromaDB                                         |
| Embeddings       | Sentence Transformers (`all-MiniLM-L6-v2`)       |
| LLM Inference    | Groq API                                         |
| Video Processing | YouTube Transcript API, yt-dlp                   |
| Deployment       | Vercel (Frontend), Hugging Face Spaces (Backend) |

---

## Project Workflow

1. User provides one or multiple YouTube video links
2. Transcripts are extracted and segmented into semantic chunks
3. Chunks are embedded using Sentence Transformers
4. Embeddings are stored in ChromaDB for retrieval
5. Relevant context is retrieved for user queries
6. Groq LLM generates summaries, answers, comparisons, and study outputs

---

## Local Setup

### Prerequisites

* Python 3.10+
* Node.js + npm
* Groq API Key

---

## Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## Deployment

### Frontend

Deployed on Vercel:

[https://video-rag-five.vercel.app/](https://video-rag-five.vercel.app/)

### Backend

Deployed using Hugging Face Spaces with Docker-based FastAPI deployment.

Note: Some cloud deployments may face transcript extraction limitations due to YouTube rate limiting and bot verification on shared infrastructure.
