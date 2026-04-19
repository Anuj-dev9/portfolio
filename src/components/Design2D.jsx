import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fetchBehanceProjects } from '../services/behanceService'
import './Design2D.css'


const categories = ['All', 'Digital Art', 'Branding & Ads', 'Posters', 'Concept Art', 'Illustration']

function useIntersect(threshold = 0.1) {
  const [isIntersected, setIsIntersected] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(e => { 
      if (e[0].isIntersecting) {
        setIsIntersected(true)
        obs.disconnect()
      }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, isIntersected]
}

export default function Design2D() {
  const [active, setActive] = useState(null)
  const [filter, setFilter] = useState('All')
  const [allDesigns, setAllDesigns] = useState([])
  
  useEffect(() => {
    fetchBehanceProjects().then(liveData => {
      if (liveData) {
        const liveDesign2D = liveData.filter(p => p.portfolioSection === 'Design2D');
        const mappedLive = liveDesign2D.map(p => {
            let cat = 'Digital Art'; // fallback
            const t = p.title.toUpperCase();
            
            // Reassign geometric/poly visual themes to Digital Art instead of 3D Art
            if (t.includes('LOWPOLY') || t.includes('CORRIDOR') || t.includes('GEOMETRIC') || t.includes('DUALITY')) cat = 'Digital Art';
            else if (t.includes('ESPORTS') || t.includes('BRAND') || t.includes('CONTRAST') || t.includes('NIKE')) cat = 'Branding & Ads';
            else if (t.includes('POSTER')) cat = 'Posters';
            else if (t.includes('EMPEROR') || t.includes('MIND') || t.includes('CYBERPUNK')) cat = 'Concept Art';
            else if (t.includes('BAKER')) cat = 'Illustration';
            
            return {
              id: p.id,
              title: p.title,
              desc: 'Discover more about this project directly in the Behance portfolio lightbox.',
              tags: [cat, 'Creative', 'Design'],
              category: cat,
              img: p.img,
              accent: '#f43f5e',
              tools: ['Photoshop', 'Illustrator', 'Blender'], 
              behance: p.behance
            };
        });
        
        // Only use the fetched Behance projects
        setAllDesigns(mappedLive)
      }
    });
  }, [])

  const [sectionRef, isIntersected] = useIntersect(0.1)
  const isVisible = isIntersected ? 'visible' : ''

  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [active])


  const filtered = filter === 'All' ? allDesigns : allDesigns.filter(d => d.category === filter)

  return (
    <section className="section d2d-section page-enter" ref={sectionRef}>
      <div className="orb orb-cyan" style={{ width:500,height:500,top:0,left:'-100px' }} />
      <div className="orb orb-pink" style={{ width:400,height:400,bottom:0,right:'-80px' }} />

      <div className="container">
        <div className={`section-header-center fade-in ${isVisible}`}>
          <p className="section-label">Professional Works</p>
          <h1 className="section-title">Visual <span className="gradient-text-pink">Design</span></h1>
          <p className="section-subtitle">
            Visual identities, posters, 3D explorations, and concept art — crafted with precision.
          </p>
        </div>

        {/* Stats row */}
        <div className={`d2d-stats fade-up ${isVisible}`}>
          {[['15+','Creative Projects'],['4','Design Tools'],['100%','Original Concepts'],['3D & 2D','Workflows']].map(([n,l]) => (
            <div key={l} className="d2d-stat glass-card">
              <span className="d2d-stat-num gradient-text-pink">{n}</span>
              <span className="d2d-stat-lbl">{l}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className={`d2d-filters fade-in ${isVisible}`}>
          {categories.map(c => (
            <button
              key={c}
              className={`fp-filter-btn ${filter === c ? 'active-pink' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Design cards */}
        <div className="d2d-grid">
          {filtered.map((d, i) => (
            <div
              key={d.id}
              className={`d2d-card glass-card fade-scale ${isVisible}`}
              style={{ '--accent': d.accent, transitionDelay: isVisible ? `${i * 0.1}s` : '0s' }}
              onClick={() => setActive(d)}
            >
              <div className="d2d-img-wrap">
                <img src={d.img} alt={d.title} className="d2d-img" loading="lazy" />
                <div className="d2d-img-overlay">
                  <div className="d2d-overlay-content">
                    <span className="d2d-view-btn">View Full ↗</span>
                  </div>
                </div>
                <div className="d2d-category-chip">{d.category}</div>
              </div>
              <div className="d2d-body">
                <h3 className="d2d-title">{d.title}</h3>
                <p className="d2d-desc">{d.desc}</p>
                <div className="d2d-meta">
                  <div className="d2d-tags">{d.tags?.map(t => <span key={t} className="tag tag-pink">{t}</span>)}</div>
                  <div className="d2d-tools">{d.tools?.map(t => <span key={t} className="d2d-tool">{t}</span>)}</div>
                </div>
                {d.behance && (
                  <a href={d.behance} target="_blank" rel="noopener noreferrer" className="d2d-behance-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6zm-6 4c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zM2 13h4v1H2v-1zm0-3h4v1H2v-1zm16-4h-4v1h4V6z"/></svg>
                    View on Behance
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Process section */}
        <div className={`d2d-process fade-up ${isVisible}`}>
          <h2 className="d2d-process-title">My <span className="gradient-text-pink">Creative Process</span></h2>
          <div className="d2d-steps">
            {[
              { step:'01', label:'Ideation', desc:'Deep-dive brainstorming to understand the thematic core and vision.' },
              { step:'02', label:'Drafting', desc:'Fast sketches, moodboards, or 3D block-outs to define the structure.' },
              { step:'03', label:'Polishing', desc:'Adding high-fidelity details, lighting, typography, and color grading.' },
              { step:'04', label:'Delivery', desc:'Polished final pieces, multi-format exports, and portfolio case studies.' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="d2d-step glass-card">
                <span className="d2d-step-num gradient-text-pink">{step}</span>
                <h4 className="d2d-step-label">{label}</h4>
                <p className="d2d-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {active && createPortal(
        <div className="d2d-lightbox" onClick={() => setActive(null)}>
          <div className="d2d-lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="d2d-lightbox-close" onClick={() => setActive(null)}>✕</button>
            <img src={active.img} alt={active.title} className="d2d-lightbox-img" />
            <div className="d2d-lightbox-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div className="d2d-category-chip" style={{ position: 'relative', top: 0, left: 0, display: 'inline-block', marginBottom: '0.75rem' }}>{active.category}</div>
                  <h3>{active.title}</h3>
                  <p>{active.desc}</p>
                  <div className="d2d-meta" style={{ marginTop: '1rem' }}>
                    <div className="d2d-tags">{active.tags?.map(t => <span key={t} className="tag tag-pink">{t}</span>)}</div>
                    <div className="d2d-tools">{active.tools?.map(t => <span key={t} className="d2d-tool">{t}</span>)}</div>
                  </div>
                </div>
                {active.behance && (
                  <a href={active.behance} target="_blank" rel="noopener noreferrer" className="d2d-behance-link" style={{ margin: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6zm-6 4c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zM2 13h4v1H2v-1zm0-3h4v1H2v-1zm16-4h-4v1h4V6z"/></svg>
                    View on Behance
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
