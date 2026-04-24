from services.embedder import get_model, get_collection


BROAD_PATTERNS = [
    "what is", "what are", "overview", "summary",
    "introduction", "used for", "about",
    "main idea", "explain"
]


def is_broad_question(question: str) -> bool:
    q = question.lower()
    return any(pattern in q for pattern in BROAD_PATTERNS)


def retrieve_relevant_chunks(video_id: str, question: str, top_k: int = 5):
    collection = get_collection(video_id)

    if is_broad_question(question):
        # deterministic — fetch first 3 chunks by ID
        ids = [f"{video_id}_{i}" for i in range(3)]
        results = collection.get(
            ids=ids,
            include=["documents", "metadatas"]
        )

        final_results = []
        for doc, meta in zip(results["documents"], results["metadatas"]):
            final_results.append({
                "text": doc,
                "start_time": meta["start_time"],
                "end_time": meta["end_time"],
                "sentences": meta.get("sentences", "").split(" || "),
                "score": None  # not distance-based, so don't fake a score
            })

        return final_results

    # specific question → semantic retrieval
    embedding_model = get_model()
    query_embedding = embedding_model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count())
    )

    final_results = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        final_results.append({
            "text": doc,
            "start_time": meta["start_time"],
            "end_time": meta["end_time"],
            "sentences": meta.get("sentences", "").split(" || "),
            "score": round(dist, 4)
        })

    return [chunk for chunk in final_results if chunk["score"] < 1.0][:3]