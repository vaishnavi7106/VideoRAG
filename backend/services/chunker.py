import tiktoken


def chunk_transcript(transcript, chunk_size=200, overlap=50):
    enc = tiktoken.get_encoding("cl100k_base")

    chunks = []
    current_chunk = []
    current_tokens = 0

    for segment in transcript:
        text = segment["text"]
        tokens = enc.encode(text)
        token_count = len(tokens)

        if current_tokens + token_count > chunk_size and current_chunk:
            chunk_text = " ".join([s["text"] for s in current_chunk])

            sentences = [s["text"] for s in current_chunk]

            chunks.append({
                "text": chunk_text,
                "start_time": current_chunk[0]["start"],
                "end_time": current_chunk[-1]["start"] + current_chunk[-1]["duration"],
                "sentences": sentences
            })

            # overlap (last few segments)
            overlap_segments = current_chunk[-3:] if len(current_chunk) >= 3 else current_chunk
            current_chunk = overlap_segments.copy()
            current_tokens = sum(len(enc.encode(s["text"])) for s in current_chunk)

        current_chunk.append(segment)
        current_tokens += token_count

    # last chunk
    if current_chunk:
        chunk_text = " ".join([s["text"] for s in current_chunk])
        sentences = [s["text"] for s in current_chunk]

        chunks.append({
            "text": chunk_text,
            "start_time": current_chunk[0]["start"],
            "end_time": current_chunk[-1]["start"] + current_chunk[-1]["duration"],
            "sentences": sentences
        })

    return chunks