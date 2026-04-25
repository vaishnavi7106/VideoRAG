import re
import tiktoken


def chunk_transcript(transcript, chunk_size=200, overlap=40):
    enc = tiktoken.get_encoding("cl100k_base")

    chunks = []
    current_chunk = []
    current_tokens = 0

    for segment in transcript:
        text = segment["text"]
        token_count = len(enc.encode(text))

        if current_tokens + token_count > chunk_size and current_chunk:
            chunk_text = " ".join([s["text"] for s in current_chunk])

            # hybrid sentence splitting:
            # try regex first (works for manually captioned videos)
            # fall back to segments if no punctuation found (auto-captions)
            sentences = re.split(r'(?<=[.!?])\s+', chunk_text)
            if len(sentences) <= 1:
                sentences = [
                    s["text"].strip()
                    for s in current_chunk
                    if s["text"].strip()
                ]

            chunks.append({
                "text": chunk_text,
                "start_time": current_chunk[0]["start"],
                "end_time": current_chunk[-1]["start"] + current_chunk[-1]["duration"],
                "sentences": sentences
            })

            overlap_segments = (
                current_chunk[-3:]
                if len(current_chunk) >= 3
                else current_chunk
            )
            current_chunk = overlap_segments.copy()
            current_tokens = sum(
                len(enc.encode(s["text"])) for s in current_chunk
            )

        current_chunk.append(segment)
        current_tokens += token_count

    if current_chunk:
        chunk_text = " ".join([s["text"] for s in current_chunk])
        sentences = re.split(r'(?<=[.!?])\s+', chunk_text)
        if len(sentences) <= 1:
            sentences = [
                s["text"].strip()
                for s in current_chunk
                if s["text"].strip()
            ]

        chunks.append({
            "text": chunk_text,
            "start_time": current_chunk[0]["start"],
            "end_time": current_chunk[-1]["start"] + current_chunk[-1]["duration"],
            "sentences": sentences
        })

    return chunks