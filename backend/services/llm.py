from services.groq_client import client

MODEL = "llama-3.3-70b-versatile"


def build_conversation_context(conversation_history: list) -> str:
    """
    Formats previous Q&A turns into a readable context block.
    """
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
            "Answer in a short paragraph (4-6 sentences). "
            "Cover the main point and supporting detail clearly."
        )
    else:
        length_instruction = (
            "Keep the answer short (maximum 2-3 sentences). "
            "Be direct and precise."
        )

    conversation_block = ""
    if conv_context:
        conversation_block = f"""
Previous conversation (use this for context and follow-up understanding):
{conv_context}

"""

    prompt = f"""You are a precise retrieval-based question answering assistant.

Answer the user's question ONLY using the provided video context.
If the question is a follow-up (e.g. "why is that?", "explain more", "what about X?"),
use the conversation history to understand what "that" refers to before answering.

Rules:
1. Do not use outside knowledge
2. {length_instruction}
3. Include only the most important relevant points
4. Do not add examples unless the context clearly supports them
5. If the answer is not clearly present, say: "I could not find that clearly in the video."

Return only the final answer.
{conversation_block}
Video Context:
{context}

Question:
{question}

Answer:"""

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400 if answer_mode == "detailed" else 256,
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
        return "I could not find enough information across these videos. Please summarize them first."

    chunks_by_video = {}
    for chunk in retrieved_chunks:
        label = chunk.get("video_label", chunk.get("video_id", "Unknown Video"))
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
        return "I could not find enough information across these videos."

    context = "\n\n".join(context_parts)
    conv_context = build_conversation_context(conversation_history or [])

    if answer_mode == "detailed":
        length_instruction = (
            "Answer in a short paragraph (5-7 lines). Cover each video's approach, "
            "similarities, differences, and a clear recommendation with reasoning."
        )
    else:
        length_instruction = (
            "Keep the answer short (maximum 4-5 lines). "
            "Lead with the direct answer, follow with brief evidence."
        )

    conversation_block = ""
    if conv_context:
        conversation_block = f"""
Previous conversation (use this for context and follow-up understanding):
{conv_context}

"""

    prompt = f"""You are a precise multi-video comparison assistant.

Your job is to compare videos based on actual evidence in their content.
If the question is a follow-up, use the conversation history to understand context.

The user may ask for:
- ranking (which is better for a specific purpose)
- comparison (how they differ in approach or depth)
- recommendation (which to watch first)
- coverage gaps (what one explains that another skips)
- contradiction detection (whether videos disagree on something)

Rules:
1. Use ONLY the provided context
2. {length_instruction}
3. Judge by actual content evidence only
4. No headings, no essays, no outside knowledge
5. If evidence is genuinely unclear, say so honestly

Return only the final answer.
{conversation_block}
Question:
{question}

Video Context:
{context}

Answer:"""

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500 if answer_mode == "detailed" else 220,
        temperature=0.0
    )

    return completion.choices[0].message.content.strip()


def generate_study_questions(chunks: list, video_title: str) -> list:
    """
    Generates comprehension questions from video content.
    Returns a list of {question, answer, start_time} dicts.
    """
    if not chunks:
        return []

    # pick evenly spaced chunks for coverage
    total = len(chunks)
    step = max(1, total // 6)
    selected = chunks[::step][:6]

    context_parts = []
    for chunk in selected:
        context_parts.append(
            f"[{round(chunk['start_time'], 0)}s] {chunk['text']}"
        )
    context = "\n\n".join(context_parts)

    prompt = f"""You are a study assistant generating comprehension questions from a video transcript.

Video: {video_title}

Generate exactly 5 comprehension questions based on the content below.
Each question should test genuine understanding, not just recall.

Rules:
1. Questions must be answerable from the provided content only
2. Mix question types: conceptual, applied, comparative
3. Each answer must be 1-2 sentences, grounded in the content
4. Include the approximate timestamp (in seconds) where the answer is found
5. No trivial questions (not "what is the title of the video?")

Return ONLY valid JSON. No markdown, no backticks.

Format:
[
  {{
    "question": "Question text here?",
    "answer": "Answer grounded in the video content.",
    "start_time": 45.0
  }}
]

Video Content:
{context}"""

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=800,
        temperature=0.2
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