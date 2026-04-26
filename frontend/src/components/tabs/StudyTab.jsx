import { useState } from 'react'
import { formatTime, openTimestamp } from '../../utils/helpers'
import SkeletonLoader from '../SkeletonLoader'

function QuestionCard({ q, index, answered, onReveal, videoId }) {
  const isAnswered = answered.has(index)

  return (
    <div style={{
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${isAnswered ? 'var(--green-border)' : 'var(--border)'}`,
      background: isAnswered ? 'var(--green-dim)' : 'var(--ink-3)',
      overflow: 'hidden', transition: 'all 0.3s ease'
    }}>
      {/* question */}
      <div style={{ padding: '13px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 5 }}>
              Q{index + 1}
            </span>
            <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
              {q.question}
            </p>
          </div>
          {!isAnswered && (
            <button onClick={() => onReveal(index)} style={{
              flexShrink: 0, height: 30, padding: '0 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-md)',
              background: 'var(--ink-4)',
              color: 'var(--text-2)', fontSize: 12,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition)', whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet-border)'; e.currentTarget.style.color = 'var(--violet)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.color = 'var(--text-2)' }}
            >
              Reveal
            </button>
          )}
          {isAnswered && (
            <span style={{ fontSize: 12, color: 'var(--green)', flexShrink: 0 }}>✓</span>
          )}
        </div>
      </div>

      {/* answer — revealed */}
      {isAnswered && (
        <div className="fade-up" style={{
          borderTop: '1px solid var(--green-border)',
          padding: '12px 14px',
          background: 'rgba(93,187,107,0.05)'
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
            {q.answer}
          </p>
          {q.start_time != null && (
            <button
              onClick={() => openTimestamp(videoId, q.start_time)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontFamily: 'var(--font-mono)',
                color: 'var(--teal)', background: 'none', border: 'none',
                cursor: 'pointer', padding: 0
              }}
            >
              {formatTime(q.start_time)} ↗
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function StudyTab({ video, study }) {
  const { questions, answered, loading, error, loaded, load, markAnswered, reset } = study

  if (!video) return (
    <div style={{ padding: 20, color: 'var(--text-3)', fontSize: 13 }}>
      Select a video to generate study questions.
    </div>
  )

  return (
    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Study Mode</p>
          {loaded && (
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
              {answered.size}/{questions.length} answered
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {loaded && (
            <button onClick={reset} style={{
              height: 30, padding: '0 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-md)',
              background: 'transparent', color: 'var(--text-3)',
              fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-sans)'
            }}>Reset</button>
          )}
          <button
            onClick={() => load(video._url)}
            disabled={loading}
            style={{
              height: 30, padding: '0 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: loading ? 'var(--ink-4)' : 'var(--amber-dim)',
              color: loading ? 'var(--text-3)' : 'var(--amber)',
              fontSize: 11, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              border: '1px solid var(--amber-border)',
              transition: 'all var(--transition)'
            }}
          >
            {loading ? 'Generating…' : loaded ? '↻ Regenerate' : 'Generate questions'}
          </button>
        </div>
      </div>

      {/* progress bar */}
      {loaded && questions.length > 0 && (
        <div style={{ height: 3, background: 'var(--ink-4)', borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
          <div style={{
            height: '100%',
            width: `${(answered.size / questions.length) * 100}%`,
            background: 'var(--green)',
            borderRadius: 99,
            transition: 'width 0.4s ease',
            boxShadow: '0 0 8px var(--green)'
          }} />
        </div>
      )}

      {/* content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        )}

        {error && (
          <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--red-dim)', color: 'var(--red)', fontSize: 13 }}>
            {error}
          </div>
        )}

        {!loading && !loaded && !error && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🧠</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6 }}>Test your understanding</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
              Generate 5 comprehension questions from this video.<br/>
              Reveal answers with timestamps when ready.
            </p>
          </div>
        )}

        {questions.map((q, i) => (
          <QuestionCard
            key={i} q={q} index={i}
            answered={answered}
            onReveal={markAnswered}
            videoId={video.video_id}
          />
        ))}

        {loaded && answered.size === questions.length && questions.length > 0 && (
          <div className="fade-up" style={{
            textAlign: 'center', padding: '20px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--green-dim)',
            border: '1px solid var(--green-border)'
          }}>
            <p style={{ fontSize: 14, color: 'var(--green)' }}>
              ✓ All questions answered
            </p>
          </div>
        )}
      </div>
    </div>
  )
}