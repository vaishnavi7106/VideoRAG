import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_answer(question: str, retrieved_chunks: list):
    context = "\n\n".join([chunk["text"] for chunk in retrieved_chunks])

    prompt = f"""You are a precise RAG assistant.

Answer the user's question ONLY using the provided context.

Strict Rules:
1. Do not use outside knowledge
2. Keep the answer short (maximum 2 sentences)
3. Include only the main important points
4. Do not include examples unless explicitly asked
5. Do not repeat phrases unnecessarily
6. If the answer is not found, say: "I could not find that in the video."

Return a clean final answer only.

Context:
{context}

Question:
{question}"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=256,
        temperature=0.0
    )

    return completion.choices[0].message.content