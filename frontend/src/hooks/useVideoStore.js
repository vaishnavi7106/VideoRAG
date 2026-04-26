import { useState, useCallback } from 'react'

export function useVideoStore() {
  const [videos, setVideos] = useState([])
  const [activeVideoId, setActiveVideoId] = useState(null)

  const addVideo = useCallback((videoData) => {
    setVideos(prev => {
      const exists = prev.find(v => v.video_id === videoData.video_id)
      if (exists) return prev
      const next = [...prev, videoData]
      // auto-set active to first ready video
      if (!videoData.status || videoData.status === 'ready') {
        setActiveVideoId(videoData.video_id)
      }
      return next
    })
  }, [])

  const updateVideo = useCallback((videoId, updates) => {
    setVideos(prev => prev.map(v =>
      v.video_id === videoId ? { ...v, ...updates } : v
    ))
  }, [])

  const removeVideo = useCallback((videoId) => {
    setVideos(prev => {
      const next = prev.filter(v => v.video_id !== videoId)
      if (activeVideoId === videoId) {
        setActiveVideoId(next.find(v => v.status === 'ready')?.video_id || null)
      }
      return next
    })
  }, [activeVideoId])

  const clearVideos = useCallback(() => {
    setVideos([])
    setActiveVideoId(null)
  }, [])

  const activeVideo = videos.find(v => v.video_id === activeVideoId) || null
  const readyVideos = videos.filter(v => v.status === 'ready')

  return {
    videos,
    activeVideoId,
    activeVideo,
    readyVideos,
    setActiveVideoId,
    addVideo,
    updateVideo,
    removeVideo,
    clearVideos
  }
}