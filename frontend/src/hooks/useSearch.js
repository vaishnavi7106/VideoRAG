import { useState, useCallback } from 'react'
import { searchVideo } from '../services/api'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const search = useCallback(async (url, q) => {
    if (!q.trim() || !url) return
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const data = await searchVideo(url, q)
      setResults(data.results || [])
    } catch (e) {
      setError(e.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    setSearched(false)
  }, [])

  return { query, setQuery, results, loading, error, searched, search, clear }
}