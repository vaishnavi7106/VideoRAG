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