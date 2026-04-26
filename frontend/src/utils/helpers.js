export function formatTime(seconds) {
  if (seconds == null || isNaN(seconds)) return '0:00'
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function openTimestamp(videoId, seconds) {
  const t = Math.floor(seconds)
  window.open(`https://www.youtube.com/watch?v=${videoId}&t=${t}`, '_blank')
}

export function extractVideoId(url) {
  const pattern = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/
  const match = url.match(pattern)
  return match ? match[1] : null
}

export function isValidYouTubeUrl(url) {
  return (
    url.includes('youtube.com/watch') ||
    url.includes('youtu.be/')
  )
}

export function generateSuggestedQuestions(videos) {
  if (!videos || videos.length === 0) return []

  if (videos.length === 1) {
    return [
      'What are the main topics covered?',
      'What are the key takeaways?',
      'Who is this video best suited for?'
    ]
  }

  const t1 = videos[0]?.video_title?.split(' ').slice(0, 3).join(' ') || 'Video 1'
  const t2 = videos[1]?.video_title?.split(' ').slice(0, 3).join(' ') || 'Video 2'

  return [
    `Which video is better for beginners?`,
    `Compare how ${t1} and ${t2} explain the core concepts`,
    `What does one video cover that the other skips?`
  ]
}