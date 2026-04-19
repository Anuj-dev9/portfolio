import { useEffect, useRef, useState } from 'react'
import { fetchGithubProjects } from '../services/githubService'
import './FrontendProjects.css'

const projects = [
  {
    id: 'bng-1',
    title: 'BNG Design Studio',
    desc: 'A modern, responsive design studio website focusing on sleek UI interactions and seamless user experiences.',
    tags: ['React', 'CSS', 'Vite'],
    category: 'Full Stack',
    accent: '#ec4899',
    icon: '✨',
    featured: true,
    links: { live: 'https://www.bngdesignstudio.com/', code: null },
    stats: [['Modern', 'Design'], ['Responsive', 'UI'], ['Fast', 'Load']],
  }
]

const cats = ['All', 'Full Stack', 'AI / ML', 'Productivity', 'Data Viz', 'Mobile', 'DevOps']

function useIntersect(cb, threshold = 0.1) {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) cb(entries[0].target)
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function FrontendProjects() {
  const [filter, setFilter] = useState('All')
  const [allProjects, setAllProjects] = useState(projects)
  const [loading, setLoading] = useState(true)

  const sectionRef = useIntersect(el => {
    el.querySelectorAll('.fade-in,.fade-up,.fade-left,.fade-right,.fade-scale')
      .forEach((e, i) => setTimeout(() => e.classList.add('visible'), i * 80))
  })

  useEffect(() => {
    async function loadGithub() {
      const liveData = await fetchGithubProjects('Anuj-dev9')
      if (liveData && liveData.length > 0) {
        setAllProjects([...projects, ...liveData])
      }
      setLoading(false)
    }
    loadGithub()
  }, [])

  const uniqueCats = ['All', ...new Set(allProjects.map(p => p.category))]
  const filtered = filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter)

  return (
    <section className="section fp-section page-enter" ref={sectionRef}>
      <div className="orb orb-pink" style={{ width:500,height:500,top:'-100px',right:'-100px' }} />
      <div className="orb orb-purple" style={{ width:400,height:400,bottom:0,left:'-80px' }} />
      <div className="grid-bg" />

      <div className="container">
        <div className="section-header-center fade-in">
          <p className="section-label">My Work</p>
          <h1 className="section-title">Frontend <span className="gradient-text">Projects</span></h1>
          <p className="section-subtitle">
            A curated selection of web applications — from AI interfaces to full-stack platforms.
          </p>
        </div>

        {/* Filter pills */}
        <div className="fp-filters fade-in">
          {uniqueCats.map(c => (
            <button
              key={c}
              id={`filter-${c.replace(/\s+/g,'-').toLowerCase()}`}
              className={`fp-filter-btn ${filter === c ? 'active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="fp-grid">
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className={`fp-card glass-card fade-scale ${p.featured ? 'fp-card--featured' : ''} visible`}
              style={{ '--accent': p.accent, transitionDelay: `${i * 0.07}s` }}
            >
              {p.featured && <div className="fp-featured-badge">⭐ Featured</div>}
              {p.isGithub && <div className="fp-featured-badge" style={{background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)'}}>Dev-9</div>}

              <div className="fp-card-top">
                <div className="fp-icon" style={{ background: `${p.accent}18` }}>
                  <span>{p.icon}</span>
                </div>
                <span className="fp-category" style={{ color: p.accent }}>{p.category}</span>
              </div>

              <h3 className="fp-title">{p.title}</h3>
              <p className="fp-desc">{p.desc}</p>

              <div className="fp-stats">
                {p.stats.map(([val, lbl]) => (
                  <div key={lbl} className="fp-stat">
                    <span className="fp-stat-val">{val}</span>
                    <span className="fp-stat-lbl">{lbl}</span>
                  </div>
                ))}
              </div>

              <div className="fp-tags">
                {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>

              <div className="fp-links">
                <a href={p.links.live} className="fp-link fp-link--live">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                  Live Demo
                </a>
                {p.links.code && p.links.code !== '#' && (
                  <a href={p.links.code} target="_blank" rel="noopener noreferrer" className="fp-link fp-link--code">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    Source
                  </a>
                )}
              </div>

              <div className="fp-card-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${p.accent}22, transparent 70%)` }} />
            </div>
          ))}
        </div>

        <div className="fp-footer fade-in">
          <a href="https://github.com/Anuj-dev9" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            View All on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
