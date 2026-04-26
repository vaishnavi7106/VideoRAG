from services.groq_client import client

MODEL = "llama-3.3-70b-versatile"

GREETINGS = {
    "hi", "hello", "hey", "hii", "hiii", "hiiii",
    "sup", "yo", "hola", "thanks", "thank you",
    "ok", "okay", "cool", "nice", "good", "great",
    "bye", "goodbye", "lol", "lmao", "haha", "hmm",
    "what", "who are you", "what are you", "test",
    "testing", "ping", "help"
}


def is_out_of_context(question: str) -> bool:
    """
    Detects greetings and out-of-context messages
    that shouldn't hit the retrieval pipeline.
    """
    q = question.strip().lower().rstrip("?!.,")
    if q in GREETINGS:
        return True
    if len(q.split()) <= 2 and not any(
        word in q for word in [
            "who", "what", "when", "where", "why", "how",
            "did", "does", "is", "are", "was", "were",
            "can", "could", "would", "should", "will"
        ]
    ):
        return True
    return False


def build_conversation_context(conversation_history: list) -> str:
    if not conversation_history:
        return ""
    lines = []
    for turn in conversation_history:
        role = turn.get("role", "")
        content = turn.get("content", "").strip()
        if role == "user":
            lines.append(f"User: {content}")
        elif role == "assistant":
            lines.append(f"Assistant: {content}")
    return "\n".join(lines)


def generate_answer(
    question: str,
    retrieved_chunks: list,
    answer_mode: str = "concise",
    conversation_history: list = None
) -> str:
    context = "\n\n".join([chunk["text"] for chunk in retrieved_chunks])
    conv_context = build_conversation_context(conversation_history or [])

    if answer_mode == "detailed":
        length_instruction = (
            "Write a structured answer: start with one bold direct sentence "
            "(the core answer), then 3-5 sentences of supporting detail. "
            "Use a line break between the direct answer and the detail."
        )
    else:
        length_instruction = (
            "Start with one direct sentence that is the core answer. "
            "Then add 1-2 sentences of supporting detail only if necessary. "
            "Maximum 3 sentences total."
        )

    conversation_block = ""
    if conv_context:
        conversation_block = f"""
Previous conversation (use for follow-up context):
{conv_context}

"""

    prompt = f"""You are a precise retrieval-based question answering assistant.

Answer the user's question ONLY using the provided video context.
If the question is a follow-up, use the conversation history to understand what it refers to.

Rules:
1. Do not use outside knowledge
2. {length_instruction}
3. Lead with the direct answer — never start with "Based on the video" or "According to"
4. If the answer is not clearly present, say: "The video doesn't clearly cover this."
5. Return only the final answer text

{conversation_block}Video Context:
{context}

Question: {question}

Answer:"""

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400 if answer_mode == "detailed" else 220,
        temperature=0.0
    )

    return completion.choices[0].message.content.strip()


def generate_comparison_answer(
    question: str,
    retrieved_chunks: list,
    answer_mode: str = "concise",
    conversation_history: list = None
) -> str:
    if not retrieved_chunks:
        return "No video content found. Please summarize the videos first."

    chunks_by_video = {}
    for chunk in retrieved_chunks:
        label = chunk.get("video_label", chunk.get("video_id", "Unknown"))
        if label not in chunks_by_video:
            chunks_by_video[label] = []
        text = chunk.get("text", "").strip()
        if text:
            chunks_by_video[label].append(text)

    context_parts = []
    for label, texts in chunks_by_video.items():
        combined = " ".join(texts)
        if combined:
            context_parts.append(f"[{label}]\n{combined}")

    if not context_parts:
        return "No content found for these videos."

    context = "\n\n".join(context_parts)
    conv_context = build_conversation_context(conversation_history or [])

    if answer_mode == "detailed":
        length_instruction = (
            "Start with one direct sentence giving the core verdict. "
            "Then give 4-6 lines of specific evidence per video. "
            "End with a clear recommendation."
        )
    else:
        length_instruction = (
            "Start with one direct sentence giving the core verdict. "
            "Then 2-3 lines of evidence. Maximum 4-5 lines total."
        )

    conversation_block = ""
    if conv_context:
        conversation_block = f"""
Previous conversation (use for follow-up context):
{conv_context}

"""

    prompt = f"""You are a precise multi-video comparison assistant.

Compare videos based on actual evidence in their transcripts.
If this is a follow-up question, use conversation history for context.

Rules:
1. Use ONLY the provided context
2. {length_instruction}
3. Lead with the direct verdict — never start with "Based on" or "According to"
4. Judge by specific content evidence only
5. No headings, no bullet points, no outside knowledge
6. If evidence is insufficient, say so honestly

{conversation_block}Question: {question}

Video Context:
{context}

Answer:"""

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500 if answer_mode == "detailed" else 250,
        temperature=0.0
    )

    return completion.choices[0].message.content.strip()


def explain_search_result(
    query: str,
    chunk_text: str,
    start_time: float,
    end_time: float
) -> str:
    """
    Takes a raw transcript chunk from search results and generates
    a clean 1-sentence explanation of what's happening at that moment.
    Replaces the raw transcript display in the search UI.
    """
    minutes_start = int(start_time // 60)
    seconds_start = int(start_time % 60)

    prompt = f"""A user searched for "{query}" in a video transcript.

This is the raw transcript segment found at {minutes_start}:{seconds_start:02d}:

"{chunk_text}"

Write exactly one clean sentence (15-25 words) explaining what is being discussed 
at this moment in the video. Make it useful as a search result preview.
Do not start with "At this point" or "In this segment".
Just describe what is happening or being explained.

Return only the single sentence, nothing else."""

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=60,
            temperature=0.1
        )
        return completion.choices[0].message.content.strip().strip('"')
    except Exception:
        # fallback: clean up the raw text
        text = chunk_text.strip()
        if len(text) > 120:
            text = text[:120] + "…"
        return text


def generate_session_title(first_question: str, video_titles: list) -> str:
    video_context = ", ".join(video_titles[:2]) if video_titles else ""

    prompt = f"""Generate a short 4-6 word title for a conversation that started with this question.

The title should:
- Capture the core topic of the question
- Be specific, not generic
- Read naturally like a chat title
- NOT start with "How", "What", "Why", "Can"
- No punctuation at the end
- No quotes

Question: "{first_question}"
Videos: {video_context}

Return only the title, nothing else."""

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=20,
            temperature=0.3
        )
        return completion.choices[0].message.content.strip().strip('"').strip("'")
    except Exception:
        words = first_question.split()[:5]
        return " ".join(words) + ("…" if len(first_question.split()) > 5 else "")


def generate_study_questions(chunks: list, video_title: str) -> list:
    """
    Generates intelligent comprehension questions using Bloom's taxonomy.
    Forces application, analysis and evaluation — not just recall.
    """
    if not chunks:
        return []

    total = len(chunks)
    step = max(1, total // 6)
    selected = chunks[::step][:6]

    context_parts = []
    for chunk in selected:
        context_parts.append(f"[{round(chunk['start_time'], 0)}s] {chunk['text']}")
    context = "\n\n".join(context_parts)

    prompt = f"""You are an expert educator generating high-quality comprehension questions.

Video: {video_title}

Generate exactly 5 questions that test genuine understanding — NOT surface recall.

Question types to use (one each, in this order):
1. APPLICATION — "How would you use X to solve Y?"
2. ANALYSIS — "Why does X happen / what causes X?"  
3. COMPARISON — "What is the difference between X and Y?"
4. EVALUATION — "What are the limitations or tradeoffs of X?"
5. SYNTHESIS — "If X is true, what does that imply about Y?"

Rules:
1. Each question must require understanding, not just memorization
2. Questions must be answerable from the content only
3. Answers must be 2-3 sentences, specific and grounded in the content
4. Include the approximate timestamp in seconds
5. Make questions specific to THIS video's content — not generic
6. Bad question: "What are the key topics?" — too vague
7. Good question: "Why did the patient's symptoms rule out tetanus as a diagnosis?"

Return ONLY valid JSON. No markdown, no backticks.

[
  {{
    "question": "Specific question here?",
    "answer": "Specific 2-3 sentence answer grounded in the video content.",
    "start_time": 45.0,
    "type": "application"
  }}
]

Video Content:
{context}"""

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
        temperature=0.3
    )

    import json, re
    response = completion.choices[0].message.content.strip()
    response = re.sub(r"^```json", "", response)
    response = re.sub(r"^```", "", response)
    response = re.sub(r"```$", "", response)

    try:
        return json.loads(response.strip())
    except Exception:
        return []