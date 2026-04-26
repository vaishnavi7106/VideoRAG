from services.embedder import get_model, get_collection

BROAD_PATTERNS = [
    "what is", "what are", "overview", "summary",
    "introduction", "explain", "basics",
    "used for", "purpose", "about", "main idea"
]


def is_broad_question(question: str) -> bool:
    q = question.lower()
    return any(pattern in q for pattern in BROAD_PATTERNS)


def retrieve_relevant_chunks(video_id: str, question: str, top_k: int = 3):
    collection = get_collection(video_id)
    if collection.count() == 0:
        return []

    embedding_model = get_model()
    query_embedding = embedding_model.encode(question).tolist()
    k = 5 if is_broad_question(question) else top_k

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(k, collection.count())
    )

    final_results = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        sentences = meta.get("sentences", "")
        final_results.append({
            "text": doc,
            "start_time": meta["start_time"],
            "end_time": meta["end_time"],
            "sentences": sentences.split(" || ") if sentences else [],
            "score": round(dist, 4)
        })

    return final_results


def retrieve_comparison_chunks(video_id: str, question: str):
    collection = get_collection(video_id)
    if collection.count() == 0:
        return []

    embedding_model = get_model()
    query_embedding = embedding_model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(3, collection.count())
    )

    final_results = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        sentences = meta.get("sentences", "")
        final_results.append({
            "text": doc,
            "start_time": meta["start_time"],
            "end_time": meta["end_time"],
            "sentences": sentences.split(" || ") if sentences else [],
            "score": round(dist, 4)
        })

    return final_results


def search_transcript(video_id: str, query: str, top_k: int = 8):
    """
    Hybrid search: combines semantic similarity with exact keyword matching.
    Keyword matches get a strong score boost so exact terms always surface.
    """
    collection = get_collection(video_id)
    if collection.count() == 0:
        return []

    embedding_model = get_model()
    query_embedding = embedding_model.encode(query).tolist()

    # fetch more candidates so keyword boosting has more to work with
    fetch_k = min(max(top_k * 3, 20), collection.count())

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=fetch_k
    )

    query_lower = query.lower().strip()
    query_terms = [t for t in query_lower.split() if len(t) > 2]

    hits = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        doc_lower = doc.lower()
        sentences = meta.get("sentences", "")
        sentence_list = sentences.split(" || ") if sentences else []

        # keyword boost: exact phrase match gets biggest boost,
        # individual term matches get smaller boost
        keyword_boost = 0.0
        if query_lower in doc_lower:
            keyword_boost = 0.6  # exact phrase — strong boost
        else:
            matched_terms = sum(1 for t in query_terms if t in doc_lower)
            if matched_terms > 0:
                keyword_boost = 0.15 * matched_terms  # partial match

        # adjusted score (lower = better in cosine distance space)
        adjusted_score = dist - keyword_boost

        hits.append({
            "text": doc,
            "start_time": meta["start_time"],
            "end_time": meta["end_time"],
            "sentences": sentence_list,
            "score": round(dist, 4),
            "adjusted_score": adjusted_score,
            "has_exact_match": query_lower in doc_lower
        })

    # sort by adjusted score — exact matches always float to top
    hits.sort(key=lambda x: x["adjusted_score"])

    # return top_k, strip internal scoring field
    final = []
    for h in hits[:top_k]:
        final.append({
            "text": h["text"],
            "start_time": h["start_time"],
            "end_time": h["end_time"],
            "sentences": h["sentences"],
            "score": h["score"],
            "has_exact_match": h["has_exact_match"]
        })

    return final