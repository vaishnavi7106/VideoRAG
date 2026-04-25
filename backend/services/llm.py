from services.groq_client import client

MODEL = "llama-3.3-70b-versatile"


def generate_answer(
    question: str,
    retrieved_chunks: list,
    answer_mode: str = "concise"
) -> str:
    context = "\n\n".join([chunk["text"] for chunk in retrieved_chunks])

    if answer_mode == "detailed":
        length_instruction = "Answer in a short paragraph (4-6 sentences). Cover the main point and supporting detail clearly."
    else:
        length_instruction = "Keep the answer short (maximum 2-3 sentences). Be direct and precise."

    prompt = f"""You are a precise retrieval-based question answering assistant.

Answer the user's question ONLY using the provided context.

Rules:
1. Do not use outside knowledge
2. {length_instruction}
3. Include only the most important relevant points
4. Do not add examples unless the context clearly supports them
5. If the answer is not clearly present, say: "I could not find that clearly in the video."

Return only the final answer.

Context:
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
    answer_mode: str = "concise"
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

    if answer_mode == "detailed":
        length_instruction = "Answer in a short paragraph (5-7 lines). Cover each video's approach, similarities, differences, and a clear recommendation with reasoning."
    else:
        length_instruction = "Keep the answer short (maximum 4-5 lines). Lead with the direct answer, follow with brief evidence."

    prompt = f"""You are a precise multi-video comparison assistant.

Your job is to compare videos based on actual evidence in their content.

The user may ask for:
- ranking (which is better for a specific purpose)
- comparison (how they differ in approach or depth)
- recommendation (which to watch first)
- coverage gaps (what one explains that another skips)
- contradiction detection (whether videos disagree on something)

Determine the evaluation criteria from the actual question itself.

Rules:
1. Use ONLY the provided context
2. {length_instruction}
3. Judge by actual content evidence only:
   - specific steps shown, definitions given, examples used
   - assumptions made, depth of explanation, topic coverage
   - what is explained vs what is skipped
4. Ignore vague phrases like "easy", "beginner-friendly", "great for all levels"
   unless backed by actual content evidence
5. Do NOT assume generic rules like shorter is better or simpler is better
6. No headings, no essays, no outside knowledge
7. If evidence is genuinely unclear or insufficient, say so honestly

Return only the final answer.

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