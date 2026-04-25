import json
import re
from services.groq_client import client

MODEL = "llama-3.3-70b-versatile"


def clean_json_response(response: str) -> str:
    response = response.strip()
    response = re.sub(r"^```json", "", response)
    response = re.sub(r"^```", "", response)
    response = re.sub(r"```$", "", response)
    return response.strip()


def select_summary_chunks(chunks: list) -> list:
    if not chunks:
        return []

    total = len(chunks)
    indices = sorted(set(filter(
        lambda i: 0 <= i < total,
        [
            0,
            min(1, total - 1),
            min(2, total - 1),
            total // 4,
            total // 2,
            (3 * total) // 4,
            total - 1
        ]
    )))

    return [chunks[i] for i in indices]


def generate_video_summary(chunks: list, mode: str = "concise") -> dict:
    if not chunks:
        return {
            "summary": "No content found for this video.",
            "key_sections": []
        }

    selected = select_summary_chunks(chunks)

    context_parts = []
    for chunk in selected:
        context_parts.append(
            f"Start: {round(chunk['start_time'], 2)}s | "
            f"End: {round(chunk['end_time'], 2)}s\n"
            f"{chunk['text']}"
        )

    context = "\n\n".join(context_parts)

    if mode == "detailed":
        summary_instruction = (
            "5-7 sentences. Cover all major topics taught, key concepts explained, "
            "the teaching style, and who this video is best suited for."
        )
        section_instruction = (
            "2-3 sentences per section. Specific enough that a viewer knows "
            "exactly what they will learn and why it matters."
        )
        max_tokens = 1400
    else:
        summary_instruction = "2-3 sentences. High level overview only."
        section_instruction = "1-2 sentences. Specific and immediately useful."
        max_tokens = 800

    prompt = f"""You are a precise video summarization assistant.

Your job is to create:
1. A summary of the full video
2. Exactly 4-5 clickable chapter sections with timestamps

Rules:
1. Use ONLY the provided content
2. Preserve the real teaching or explanation order
3. Summary: {summary_instruction}
4. Create exactly 4-5 key sections — no more, no less
5. Do NOT create duplicate or overlapping sections
6. Merge closely related topics into one section
7. NEVER use these vague section titles:
   "Introduction", "Overview", "Basics", "Getting Started",
   "Conclusion", "Summary", "Recap", "Wrap Up"
8. Section titles must reflect the specific skill or concept taught:
   GOOD: "Installing Python and Setting Up PATH"
   GOOD: "Writing and Calling Your First Function"
   BAD: "Introduction to Python"
   BAD: "Getting Started"
9. Each section must have: title, start_time, end_time, section_summary
10. Section summary: {section_instruction}
11. No fluff, no vague language

Return ONLY valid JSON. No markdown, no backticks, no explanation outside the JSON.

Format:
{{
  "summary": "overall summary here",
  "key_sections": [
    {{
      "title": "Specific Section Title",
      "start_time": 45.7,
      "end_time": 120.0,
      "section_summary": "Explanation of what this section teaches."
    }}
  ]
}}

Video Content:
{context}"""

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
        temperature=0.0
    )

    response = completion.choices[0].message.content

    try:
        cleaned = clean_json_response(response)
        parsed = json.loads(cleaned)

        if "summary" not in parsed or "key_sections" not in parsed:
            raise ValueError("Missing required keys")

        return parsed

    except Exception:
        return {
            "summary": response.strip(),
            "key_sections": []
        }