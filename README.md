# VideoRAG

VideoRAG is a full-stack AI-powered platform for understanding long-form YouTube content through timestamp-grounded Retrieval-Augmented Generation (RAG).

Instead of relying on generic summaries, the system helps users evaluate videos before watching them by providing answers linked to exact transcript timestamps for verification.

The platform is designed for tutorials, lectures, documentaries, podcasts, case analysis videos, medical discussions, finance explainers, and other long-form content where users need fast and reliable understanding before investing time.

---

## What VideoRAG Solves

Users often struggle with:

* deciding which video is actually worth watching
* comparing multiple videos covering the same topic
* finding the exact part where something is explained
* verifying whether an answer is grounded in the source

VideoRAG addresses this by providing:

* multi-video comparison
* timestamp-grounded question answering
* semantic search across transcripts
* worth-watching evaluation
* persistent session history

---

## Key Features

### Multi-Video Comparison

Compare multiple YouTube videos to determine:

* which video explains a topic more effectively
* what each video covers or skips
* which video is most suitable for a specific use case
* whether a video is worth watching at all

This serves as the core product feature and helps reduce decision fatigue when choosing between long-form videos.

---

### Timestamp-Grounded Question Answering

Users can ask questions about any uploaded video and receive answers supported by exact transcript references.

Each answer includes timestamp-linked evidence, allowing users to verify responses directly from the source instead of relying on unsupported LLM output.

---

### Semantic Search

The platform supports concept-based search across video transcripts.

Users can search for topics such as technical concepts, medical terms, case references, or specific explanations and instantly locate the relevant sections of the video.

---

### Worth Watching Analysis

Before committing time to a video, users receive a structured evaluation including:

* target audience
* coverage scope
* missing areas
* recommendation on whether the video is worth watching

This improves decision-making before consuming long content.

---

### Study Mode

For educational content, the system generates comprehension-focused questions based on the transcript to support revision and deeper understanding.

This is especially useful for lectures, tutorials, and exam preparation workflows.

---

### Persistent Session History

Conversation sessions are preserved with:

* uploaded videos
* summaries and key sections
* source references
* follow-up question context
* compare mode state

This allows users to return to previous workspaces without losing continuity.

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* LocalStorage (session persistence)

### Backend

* FastAPI
* Python

### AI and Retrieval Layer

* ChromaDB (vector database)
* Sentence Transformers (embeddings)
* YouTube Transcript API
* Groq LLM API
* Retrieval-Augmented Generation (RAG)

---

## System Design

The backend handles:

* transcript extraction
* semantic chunking
* embedding generation
* vector retrieval
* summarization
* LLM-based response generation

The frontend handles:

* workspace sessions
* UI state
* conversation persistence using localStorage

This architecture ensures:

* no authentication friction
* fast onboarding
* isolated session history
* timestamp-verifiable answers
* scalable retrieval-based querying

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

## Current Status

The project is under active development with ongoing improvements in retrieval quality, session management, study mode quality, and overall product UX.
