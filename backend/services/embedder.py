from sentence_transformers import SentenceTransformer
import chromadb
import os

model = None
chroma_client = None


def get_model():
    global model
    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model


def get_chroma_client():
    global chroma_client
    if chroma_client is None:
        # use persistent storage locally, ephemeral on HF Spaces
        if os.getenv("HF_SPACE", "false").lower() == "true":
            chroma_client = chromadb.EphemeralClient()
        else:
            chroma_client = chromadb.PersistentClient(path="./chroma_db")
    return chroma_client


def get_collection(video_id: str):
    client = get_chroma_client()
    return client.get_or_create_collection(name=f"v_{video_id}")


def embed_and_store(video_id: str, chunks: list):
    embedding_model = get_model()
    collection = get_collection(video_id)

    existing = collection.count()
    if existing > 0:
        return {"status": "cached", "chunks": existing}

    texts = [chunk["text"] for chunk in chunks]
    metadatas = [
        {
            "start_time": chunk["start_time"],
            "end_time": chunk["end_time"],
            "sentences": " || ".join(chunk["sentences"])
        }
        for chunk in chunks
    ]
    ids = [f"{video_id}_{i}" for i in range(len(chunks))]
    embeddings = embedding_model.encode(texts).tolist()

    collection.add(
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

    return {"status": "embedded", "chunks": len(texts)}