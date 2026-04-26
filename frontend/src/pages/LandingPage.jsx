import { useEffect, useRef } from 'react'

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      padding: '22px 20px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border)',
      background: 'var(--ink-2)',
      transition: 'all 0.25s ease',
      cursor: 'default'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'var(--violet-border)'
      e.currentTarget.style.background = 'var(--ink-3)'
      e.currentTarget.style.boxShadow = '0 0 24px var(--violet-glow)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)'
      e.currentTarget.style.background = 'var(--ink-2)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>{title}</p>
      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

function StepCard({ num, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'var(--violet-dim)',
        border: '1px solid var(--violet-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600, color: 'var(--violet-2)',
        flexShrink: 0, boxShadow: '0 0 12px var(--violet-glow)'
      }}>{num}</div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>{title}</p>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function LandingPage({ onEnter }) {
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', color: 'var(--text)' }}>

      {/* nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 56, padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, background: 'var(--violet)',
            borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px var(--violet-glow)'
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>VideoRAG</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="#features" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none' }}>Features</a>
          <a href="#how" style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', marginRight: 4 }}>How it works</a>
          <button onClick={onEnter} style={{
            height: 34, padding: '0 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none', background: 'var(--violet)',
            color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
            boxShadow: '0 0 16px var(--violet-glow)',
            transition: 'all var(--transition)'
          }}>Try it free →</button>
        </div>
      </nav>

      {/* hero */}
      <section style={{
        minHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px 24px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* background glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(139,127,248,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="stagger" style={{ maxWidth: 680, position: 'relative' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--violet-2)',
            background: 'var(--violet-dim)',
            border: '1px solid var(--violet-border)',
            padding: '4px 14px', borderRadius: 99, marginBottom: 24
          }}>
            Timestamp-grounded AI for YouTube
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 7vw, 72px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: 22
          }}>
            Stop watching.<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--violet) 0%, var(--teal) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Start learning.</span>
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text-2)',
            lineHeight: 1.7, marginBottom: 36,
            maxWidth: 520, margin: '0 auto 36px'
          }}>
            Paste any YouTube video. Ask if it's worth your time.
            Ask anything — and jump to the <em style={{ color: 'var(--text)', fontStyle: 'normal' }}>exact moment</em> the answer comes from.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onEnter} style={{
              height: 48, padding: '0 28px',
              borderRadius: 'var(--radius-lg)', border: 'none',
              background: 'var(--violet)', color: '#fff',
              fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              boxShadow: '0 0 32px var(--violet-glow)',
              transition: 'all var(--transition)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              Open workspace →
            </button>
            <a href="#how" style={{
              height: 48, padding: '0 24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-md)',
              background: 'transparent', color: 'var(--text-2)',
              fontSize: 15, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center',
              textDecoration: 'none',
              transition: 'all var(--transition)'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-lg)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.color = 'var(--text-2)' }}
            >
              How it works
            </a>
          </div>
        </div>

        {/* mock UI preview */}
        <div className="hero-float" style={{
          marginTop: 60, width: '100%', maxWidth: 780,
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-md)',
          background: 'var(--ink-2)',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px var(--border-md), 0 0 60px var(--violet-glow)'
        }}>
          {/* mock topbar */}
          <div style={{ height: 40, background: 'var(--ink-3)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6 }}>
            {['#e05c5c','#f9a825','#5dbb6b'].map((c,i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
            ))}
            <div style={{ flex: 1, height: 18, borderRadius: 4, background: 'var(--ink-4)', margin: '0 10px' }} />
          </div>
          {/* mock content */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 220px', height: 240 }}>
            <div style={{ borderRight: '1px solid var(--border)', padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[1,2].map(i => (
                <div key={i} style={{ height: 44, borderRadius: 7, background: i === 1 ? 'var(--violet-dim)' : 'var(--ink-3)', border: `1px solid ${i === 1 ? 'var(--violet-border)' : 'transparent'}` }} />
              ))}
              <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 30, borderRadius: 6, background: 'var(--ink-3)' }} />
              ))}
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ height: 80, borderRadius: 10, background: 'var(--violet-dim)', border: '1px solid var(--violet-border)' }} />
              {[100, 60, 60, 60].map((h,i) => (
                <div key={i} className="skeleton" style={{ height: h, borderRadius: 8 }} />
              ))}
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ height: 50, borderRadius: 10, background: 'var(--violet-dim)', border: '1px solid var(--violet-border)', marginLeft: 'auto', width: '80%' }} />
              <div style={{ height: 70, borderRadius: 8, background: 'var(--ink-3)' }} />
              <div style={{ height: 26, borderRadius: 99, background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', width: 100 }} />
              <div style={{ flex: 1 }} />
              <div style={{ height: 36, borderRadius: 8, background: 'var(--ink-3)', border: '1px solid var(--border-md)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* problem section */}
      <section style={{ padding: '80px 24px', maxWidth: 840, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--violet-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>The problem</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 16 }}>
              The average tutorial is 47 minutes.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7 }}>
              You don't know if it's worth it until you're 40 minutes in. We fix that.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['❌', 'You watch the whole thing. It was basic.'],
              ['❌', 'You skip around. Miss the important part.'],
              ['❌', 'You ask ChatGPT. It makes up timestamps.'],
            ].map(([icon, text], i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: '12px 14px', borderRadius: 'var(--radius-md)',
                background: 'var(--ink-2)', border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" style={{ padding: '80px 24px', maxWidth: 560, margin: '0 auto' }}>
        <p style={{ fontSize: 12, color: 'var(--violet-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, textAlign: 'center' }}>How it works</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, textAlign: 'center', marginBottom: 40, letterSpacing: '-0.02em' }}>
          Three steps to clarity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <StepCard num="1" title="Paste a YouTube URL" desc="We fetch the full transcript, chunk it into semantic segments, and embed everything into a vector database. Takes about 10 seconds." />
          <StepCard num="2" title="Ask anything" desc="Every answer is retrieved from actual transcript chunks — not hallucinated. The model only uses what was said in the video." />
          <StepCard num="3" title="Jump to the exact moment" desc="Click any source chip. Opens YouTube at precisely that second. You can verify every single answer." />
        </div>
      </section>

      {/* features */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: 12, color: 'var(--violet-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, textAlign: 'center' }}>Features</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, textAlign: 'center', marginBottom: 40, letterSpacing: '-0.02em' }}>
          Everything you need, nothing you don't
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <FeatureCard icon="✦" title="Worth Watching?" desc="3-sentence verdict before you commit. Target audience, what it covers, what it skips — from the first 30 seconds." />
          <FeatureCard icon="🔍" title="Semantic Search" desc="Type a concept. Find every moment it's discussed, ranked by relevance. Not keyword matching — actual understanding." />
          <FeatureCard icon="📚" title="Compare Videos" desc="Load 3 tutorials side by side. Ask which one actually explains the hard part. Get a grounded comparison, not a guess." />
          <FeatureCard icon="🧠" title="Study Mode" desc="5 comprehension questions generated from the content. Flip to reveal answers with timestamps." />
          <FeatureCard icon="💬" title="Conversation Memory" desc="Follow-up questions actually work. 'Why is that?' understands what 'that' refers to. Full context retained." />
          <FeatureCard icon="📌" title="Chat History" desc="Every conversation saved by video. Switch between sessions. Nothing gets lost." />
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 24px 80px',
        maxWidth: 840, marginLeft: 'auto', marginRight: 'auto',
        padding: '60px 40px', borderRadius: 'var(--radius-2xl)',
        background: 'var(--ink-2)',
        border: '1px solid var(--violet-border)',
        textAlign: 'center',
        boxShadow: '0 0 60px var(--violet-glow)'
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em' }}>
          Ready to stop guessing?
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 28 }}>
          Open the workspace. Paste a URL. Ask anything.
        </p>
        <button onClick={onEnter} style={{
          height: 48, padding: '0 32px',
          borderRadius: 'var(--radius-lg)', border: 'none',
          background: 'var(--violet)', color: '#fff',
          fontSize: 15, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
          boxShadow: '0 0 32px var(--violet-glow)',
          transition: 'all var(--transition)'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          Open workspace →
        </button>
      </section>

      {/* footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600 }}>VideoRAG</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>· Answers grounded in video content. No hallucination.</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Built with FastAPI + ChromaDB + Groq</span>
      </footer>
    </div>
  )
}