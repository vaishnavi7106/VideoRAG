import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import { generateSuggestedQuestions } from '../utils/helpers'

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '4px 2px', marginBottom: 4 }}>
      {[1,2,3].map(n => (
        <span key={n} className="tdot" style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--violet)', display: 'inline-block'
        }} />
      ))}
    </div>
  )
}

export default function ChatPanel({ videos, messages, onAsk, loading, answerMode, onModeChange }) {
  const [question, setQuestion] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const suggestions = generateSuggestedQuestions(videos)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleSubmit(e) {
    e.preventDefault()
    const q = question.trim()
    if (!q || loading) return
    onAsk(q)
    setQuestion('')
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%',
      background: 'var(--ink-2)',
      borderLeft: '1px solid var(--border)'
    }}>
      {/* header */}
      <div style={{
        height: 48, padding: '0 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
            {videos.length > 1 ? 'Compare & Ask' : 'Ask'}
          </span>
          {videos.length > 1 && (
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 99,
              background: 'var(--violet-dim)', color: 'var(--violet-2)',
              border: '1px solid var(--violet-border)'
            }}>
              {videos.length} videos
            </span>
          )}
        </div>
        <div style={{
          display: 'flex', border: '1px solid var(--border-md)',
          borderRadius: 'var(--radius-sm)', overflow: 'hidden'
        }}>
          {['concise', 'detailed'].map(m => (
            <button key={m} onClick={() => onModeChange(m)} style={{
              padding: '3px 10px', fontSize: 11,
              fontFamily: 'var(--font-sans)', border: 'none',
              background: answerMode === m ? 'var(--violet)' : 'transparent',
              color: answerMode === m ? '#fff' : 'var(--text-3)',
              cursor: 'pointer', transition: 'all var(--transition)'
            }}>{m}</button>
          ))}
        </div>
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        {messages.length === 0 && !loading && (
          <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Suggested
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => onAsk(s)} style={{
                  textAlign: 'left', padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--ink-3)',
                  color: 'var(--text-2)', fontSize: 13,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  lineHeight: 1.45, transition: 'all var(--transition)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet-border)'; e.currentTarget.style.background = 'var(--ink-4)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--ink-3)' }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} index={i} />
          ))}
          {loading && <TypingDots />}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder={videos.length > 1 ? 'Ask anything across these videos…' : 'Ask about this video…'}
            disabled={loading}
            rows={1}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-md)',
              background: 'var(--ink-3)',
              color: 'var(--text)', fontSize: 13,
              fontFamily: 'var(--font-sans)', outline: 'none',
              resize: 'none', lineHeight: 1.5,
              maxHeight: 100, overflowY: 'auto',
              transition: 'border var(--transition)'
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--violet)'; e.target.style.boxShadow = '0 0 0 3px var(--violet-dim)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-md)'; e.target.style.boxShadow = 'none' }}
          />
          <button type="submit" disabled={loading || !question.trim()} style={{
            height: 38, padding: '0 16px',
            borderRadius: 'var(--radius-md)', border: 'none',
            background: loading || !question.trim() ? 'var(--ink-4)' : 'var(--violet)',
            color: loading || !question.trim() ? 'var(--text-3)' : '#fff',
            cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 500,
            fontFamily: 'var(--font-sans)', flexShrink: 0,
            transition: 'all var(--transition)'
          }}>Ask</button>
        </form>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
          ↵ to send · Shift+↵ new line · Follow-ups work
        </p>
      </div>
    </div>
  )
}