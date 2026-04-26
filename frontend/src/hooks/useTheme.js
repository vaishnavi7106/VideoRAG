import { useEffect, useState } from 'react'

export function useTheme() {
  // VideoRAG is dark-first by design — toggle switches to a slightly lighter dark
  const [dark, setDark] = useState(true)

  useEffect(() => {
    // just keep dark always — remove the broken class toggle
    document.documentElement.classList.add('dark')
  }, [])

  // No-op toggle for now — app is dark-only
  const toggle = () => {}

  return { dark, toggle }
}