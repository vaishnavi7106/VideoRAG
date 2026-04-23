import tiktoken


def chunk_transcript(transcript, chunk_size=200, overlap=50):
    """
    Converts transcript segments into token-based chunks with overlap.

    transcript: list of dicts with {text, start, duration}
    returns: list of chunks with text + start_time + end_time
    """

    enc = tiktoken.get_encoding("cl100k_base")

    chunks = []
    current_chunk = []
    current_tokens = 0

    for segment in transcript:
        text = segment["text"]
        tokens = enc.encode(text)
        token_count = len(tokens)

        # If adding this segment exceeds chunk size → finalize chunk
        if current_tokens + token_count > chunk_size and current_chunk:
            chunk_text = " ".join([s["text"] for s in current_chunk])

            chunks.append({
                "text": chunk_text,
                "start_time": current_chunk[0]["start"],
                "end_time": current_chunk[-1]["start"] + current_chunk[-1]["duration"]
            })

            # overlap handling
            overlap_segments = current_chunk[-3:] if len(current_chunk) >= 3 else current_chunk

            current_chunk = overlap_segments.copy()
            current_tokens = sum(len(enc.encode(s["text"])) for s in current_chunk)

        current_chunk.append(segment)
        current_tokens += token_count

    # Add final chunk
    if current_chunk:
        chunk_text = " ".join([s["text"] for s in current_chunk])

        chunks.append({
            "text": chunk_text,
            "start_time": current_chunk[0]["start"],
            "end_time": current_chunk[-1]["start"] + current_chunk[-1]["duration"]
        })

    return chunks