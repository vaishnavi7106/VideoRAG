import { useEffect, useRef } from 'react'

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      style={{
        padding: '22px 20px', borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', background: 'var(--ink-2)',
        transition: 'all 0.25s ease', cursor: 'default'
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
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <p style={{
        fontSize: 14, fontWeight: 600, color: 'var(--text)',
        marginBottom: 6, fontFamily: 'var(--font-display)'
      }}>{title}</p>
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
        <p style={{
          fontSize: 15, fontWeight: 600, color: 'var(--text)',
          marginBottom: 4, fontFamily: 'var(--font-display)'
        }}>{title}</p>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function LandingPage({ onEnter }) {
  return (
    <div style={{
      background: 'var(--ink)', color: 'var(--text)',
      overflowY: 'auto', height: '100%'
    }}>

      {/* nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 56, padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, background: 'var(--violet)',
            borderRadius: 7, display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px var(--violet-glow)'
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em'
          }}>VideoRAG</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="#features" style={{
            fontSize: 13, color: 'var(--text-2)', textDecoration: 'none'
          }}>Features</a>
          <a href="#how" style={{
            fontSize: 13, color: 'var(--text-2)', textDecoration: 'none'
          }}>How it works</a>
          <button onClick={onEnter} style={{
            height: 34, padding: '0 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none', background: 'var(--violet)', color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 0 16px var(--violet-glow)',
            transition: 'all var(--transition)'
          }}>Open workspace →</button>
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
        <div style={{
          position: 'absolute', top: '35%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(139,127,248,0.1) 0%, transparent 68%)',
          pointerEvents: 'none'
        }} />

        <div className="stagger" style={{ maxWidth: 700, position: 'relative' }}>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--violet-2)', background: 'var(--violet-dim)',
            border: '1px solid var(--violet-border)',
            padding: '4px 14px', borderRadius: 99, marginBottom: 26
          }}>
            AI that reads YouTube so you don't have to
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 7vw, 74px)',
            fontWeight: 700, lineHeight: 1.07,
            letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 20
          }}>
            Stop watching.<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--violet) 0%, var(--teal) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Start understanding.</span>
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text-2)', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto 10px'
          }}>
            Compare multiple videos. Ask anything.
            Jump to the{' '}
            <em style={{ color: 'var(--text)', fontStyle: 'normal', fontWeight: 500 }}>
              exact moment
            </em>{' '}
            the answer comes from.
          </p>

          <p style={{
            fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6,
            maxWidth: 480, margin: '0 auto 36px'
          }}>
            Tutorials · Documentaries · Podcasts · Crime cases · Medical · Lectures · Finance
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onEnter} style={{
              height: 50, padding: '0 30px',
              borderRadius: 'var(--radius-lg)',
              border: 'none', background: 'var(--violet)', color: '#fff',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 0 32px var(--violet-glow)',
              transition: 'all var(--transition)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              Open workspace →
            </button>
            <a href="#how" style={{
              height: 50, padding: '0 24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-md)',
              background: 'transparent', color: 'var(--text-2)',
              fontSize: 15, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center',
              textDecoration: 'none',
              transition: 'all var(--transition)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-lg)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-md)'
              e.currentTarget.style.color = 'var(--text-2)'
            }}
            >
              How it works
            </a>
          </div>
        </div>

        {/* app preview mockup */}
        <div className="hero-float" style={{
          marginTop: 64, width: '100%', maxWidth: 820,
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-md)',
          background: 'var(--ink-2)', overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px var(--violet-glow)'
        }}>
          <div style={{
            height: 40, background: 'var(--ink-3)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6
          }}>
            {['#e05c5c','#f9a825','#5dbb6b'].map((c, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: c, opacity: 0.7
              }} />
            ))}
            <div style={{
              flex: 1, height: 18, borderRadius: 4,
              background: 'var(--ink-4)', margin: '0 10px'
            }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 230px', height: 260 }}>
            <div style={{
              borderRight: '1px solid var(--border)',
              padding: 10, display: 'flex', flexDirection: 'column', gap: 5
            }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  height: i === 1 ? 44 : 36, borderRadius: 7,
                  background: i === 1 ? 'var(--violet-dim)' : 'var(--ink-3)',
                  border: `1px solid ${i === 1 ? 'var(--violet-border)' : 'transparent'}`
                }} />
              ))}
              <div style={{ height: 1, background: 'var(--border)', margin: '3px 0' }} />
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 28, borderRadius: 6, background: 'var(--ink-3)' }} />
              ))}
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{
                height: 90, borderRadius: 10,
                background: 'var(--violet-dim)',
                border: '1px solid var(--violet-border)'
              }} />
              {[1,2,3].map(i => (
                <div key={i} className="skeleton" style={{ height: 44, borderRadius: 8 }} />
              ))}
            </div>
            <div style={{
              borderLeft: '1px solid var(--border)',
              padding: 10, display: 'flex', flexDirection: 'column', gap: 7
            }}>
              <div style={{
                height: 44, borderRadius: 10,
                background: 'var(--violet-dim)',
                border: '1px solid var(--violet-border)',
                marginLeft: '15%', width: '85%'
              }} />
              <div style={{ height: 80, borderRadius: 8, background: 'var(--ink-3)' }} />
              <div style={{
                height: 24, borderRadius: 99,
                background: 'var(--teal-dim)',
                border: '1px solid var(--teal-border)', width: 90
              }} />
              <div style={{ flex: 1 }} />
              <div style={{
                height: 36, borderRadius: 8,
                background: 'var(--ink-3)',
                border: '1px solid var(--border-md)'
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* use cases */}
      <section style={{ padding: '80px 24px', maxWidth: 860, margin: '0 auto' }}>
        <p style={{
          fontSize: 12, color: 'var(--violet-2)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14, textAlign: 'center'
        }}>Works for everything</p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700,
          lineHeight: 1.2, letterSpacing: '-0.02em',
          marginBottom: 36, textAlign: 'center'
        }}>
          Not just tutorials
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10
        }}>
          {[
            ['🎓', 'Tutorials', 'Which video explains X best? What does it skip?'],
            ['🔍', 'True Crime', 'Find exact moments. Compare case details across videos.'],
            ['🏥', 'Medical', 'Ask about diagnoses, treatments, symptoms with proof.'],
            ['🎙️', 'Podcasts', 'Skip to the insight. Find the exact quote.'],
            ['📈', 'Finance', 'Compare strategies. Find what each expert actually said.'],
            ['🍳', 'Cooking', 'Jump straight to the technique. Skip the intro.'],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              style={{
                padding: '16px', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', background: 'var(--ink-2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--violet-border)'
                e.currentTarget.style.background = 'var(--ink-3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--ink-2)'
              }}
            >
              <span style={{ fontSize: 20, display: 'block', marginBottom: 8 }}>{icon}</span>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" style={{ padding: '80px 24px', maxWidth: 560, margin: '0 auto' }}>
        <p style={{
          fontSize: 12, color: 'var(--violet-2)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14, textAlign: 'center'
        }}>How it works</p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700,
          textAlign: 'center', marginBottom: 40, letterSpacing: '-0.02em'
        }}>
          Three steps to clarity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <StepCard
            num="1"
            title="Paste any YouTube URL"
            desc="We fetch the full transcript, chunk it semantically, and embed it into a vector database. Takes about 10 seconds."
          />
          <StepCard
            num="2"
            title="Ask anything"
            desc="Every answer is retrieved from actual transcript chunks — not hallucinated. We cite the exact second."
          />
          <StepCard
            num="3"
            title="Jump to the exact moment"
            desc="Click any source chip. Opens YouTube at precisely that timestamp. Every answer is verifiable."
          />
        </div>
      </section>

      {/* features */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <p style={{
          fontSize: 12, color: 'var(--violet-2)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: 14, textAlign: 'center'
        }}>Features</p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700,
          textAlign: 'center', marginBottom: 40, letterSpacing: '-0.02em'
        }}>
          Everything you need, nothing you don't
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14
        }}>
          <FeatureCard
            icon="✦"
            title="Worth Watching?"
            desc="3-sentence verdict before you commit. Target audience, what it covers, what it skips — from the first 30 seconds."
          />
          <FeatureCard
            icon="🔍"
            title="Semantic Search"
            desc="Type a concept. Find every moment it's discussed, ranked by relevance. Exact keyword matches always surface first."
          />
          <FeatureCard
            icon="📚"
            title="Compare Videos"
            desc="Load up to 3 videos. Ask which covers the topic better. Get a grounded comparison backed by actual transcript evidence."
          />
          <FeatureCard
            icon="🧠"
            title="Study Mode"
            desc="5 comprehension questions generated from the content. Application, analysis, evaluation — not just recall."
          />
          <FeatureCard
            icon="💬"
            title="Conversation Memory"
            desc="Follow-up questions actually work. 'Why is that?' understands context. Full history retained per session."
          />
          <FeatureCard
            icon="📌"
            title="Chat History"
            desc="Every session saved with the videos used. Switch between sessions. Nothing gets lost between visits."
          />
        </div>
      </section>

      {/* CTA banner */}
      <section style={{
        margin: '0 24px 80px',
        maxWidth: 860, marginLeft: 'auto', marginRight: 'auto',
        padding: '60px 40px', borderRadius: 'var(--radius-2xl)',
        background: 'var(--ink-2)',
        border: '1px solid var(--violet-border)',
        textAlign: 'center',
        boxShadow: '0 0 60px var(--violet-glow)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 700,
          marginBottom: 14, letterSpacing: '-0.02em'
        }}>
          Ready to stop guessing?
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 28 }}>
          No account needed. Paste a URL and start immediately.
        </p>
        <button onClick={onEnter} style={{
          height: 50, padding: '0 32px',
          borderRadius: 'var(--radius-lg)',
          border: 'none', background: 'var(--violet)', color: '#fff',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
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
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* left: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 22, height: 22, background: 'var(--violet)',
            borderRadius: 6, display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px var(--violet-glow)'
          }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14, fontWeight: 600
          }}>VideoRAG</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            · No account needed · No hallucination · Your data stays local
          </span>
        </div>

        {/* right: links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* GitHub link */}
        <a
          href="https://github.com/vaishnavi7106/VideoRAG"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: 'var(--text-3)',
            textDecoration: 'none',
            transition: 'color var(--transition)'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          View source
        </a>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
          FastAPI · ChromaDB · Groq · sentence-transformers
          </span>
        </div>
      </footer>
    </div>
  )
}