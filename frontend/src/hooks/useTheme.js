import { useEffect, useState } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('vr-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('vr-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('vr-theme', 'light')
    }
  }, [dark])

  const toggle = () => setDark(d => !d)

  return { dark, toggle }
}