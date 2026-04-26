const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Server error ${res.status}`)
  }
  return res.json()
}

export const summarizeVideo = (url, summaryMode = 'concise') =>
  post('/summarize', { url, summary_mode: summaryMode })

export const askQuestion = (urls, question, answerMode = 'concise', conversationHistory = []) =>
  post('/ask', {
    urls,
    question,
    answer_mode: answerMode,
    conversation_history: conversationHistory
  })

export const searchVideo = (url, query, topK = 8) =>
  post('/search', { url, query, top_k: topK })

export const fetchStudy = (url) =>
  post('/study', { url })

export const healthCheck = () =>
  fetch(`${BASE}/`).then(r => r.json())