import { useEffect, useRef, useState } from 'react'
import './Modeling3D.css'

import { fetchArtstationProjects } from '../services/artstationService'

const software = [
  { name: '3ds Max', level: 70, icon: '🔷' },
  { name: 'Maya', level: 60, icon: '🎬' },
  { name: 'ZBrush', level: 50, icon: '🗿' },
  { name: 'Substance 3D', level: 60, icon: '🎨' },
  { name: 'After Effects', level: 80, icon: '✨' },
]

function useIntersect(cb, threshold = 0.1) {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) cb(e[0].target) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Model3DCard({ model, index }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width - 0.5) * 16
    const y = ((e.clientY - top) / height - 0.5) * -16
    setTilt({ x, y })
  }
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      ref={cardRef}
      className="m3d-card fade-scale"
      style={{
        '--accent': model.accent,
        transitionDelay: `${index * 0.12}s`,
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="m3d-img-wrap">
        <img src={model.img} alt={model.title} className="m3d-img" loading="lazy" />
        <div className="m3d-img-shine" />
        <div className="m3d-meta-overlay">
          <div className="m3d-render-stat">
            <span className="m3d-rs-val">{model.polys}</span>
            <span className="m3d-rs-lbl">Polygons</span>
          </div>
          <div className="m3d-render-stat">
            <span className="m3d-rs-val">{model.render}</span>
            <span className="m3d-rs-lbl">Renderer</span>
          </div>
          <div className="m3d-render-stat">
            <span className="m3d-rs-val">{model.time}</span>
            <span className="m3d-rs-lbl">Render Time</span>
          </div>
        </div>
        <div className="m3d-category-chip">{model.category}</div>
      </div>
      <div className="m3d-body">
        <h3 className="m3d-title">{model.title}</h3>
        <p className="m3d-desc">{model.desc}</p>
        <div className="m3d-tags">
          {model.tags.map(t => <span key={t} className="tag tag-cyan">{t}</span>)}
        </div>
        {model.artstation && (
          <a href={model.artstation} target="_blank" rel="noopener noreferrer" className="m3d-behance-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.016 1.77L2.4 18.42h5.5l9.6-16.65h-5.484zM16.148 5.6L12.18 12.5H2.4l9.78-16.9h3.968zM21.6 18.42H13.6l7.984-13.84L21.6 18.42z" /></svg>
            View on ArtStation
          </a>
        )}
      </div>
      <div className="m3d-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${model.accent}30, transparent 70%)` }} />
    </div>
  )
}

export default function Modeling3D() {
  const [animate, setAnimate] = useState(false)
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function hydrate() {
      const liveData = await fetchArtstationProjects()
      if (liveData && liveData.length > 0) {
        setModels(liveData)
      }
      setLoading(false)
    }
    hydrate()
  }, [])

  const sectionRef = useIntersect(el => {
    setAnimate(true)
    el.querySelectorAll('.fade-in,.fade-up,.fade-scale,.fade-left,.fade-right')
      .forEach((e, i) => setTimeout(() => e.classList.add('visible'), i * 80))
  })

  return (
    <section className="section m3d-section page-enter" ref={sectionRef}>
      <div className="orb orb-cyan" style={{ width: 500, height: 500, top: '-80px', right: '-80px' }} />
      <div className="orb orb-purple" style={{ width: 450, height: 450, bottom: 0, left: '-80px' }} />
      <div className="grid-bg" />

      <div className="container">
        <div className="section-header-center fade-in">
          <p className="section-label">3D Artistry</p>
          <h1 className="section-title">3D Modeling <span className="gradient-text">Showcase</span></h1>
          <p className="section-subtitle">
            Sculpted meshes, hard-surface models, and cinematic renders — from concept to final output.
          </p>
        </div>

        {/* 3D Cards with tilt */}
        <div className="m3d-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)', width: '100%' }}>
              Syncing with ArtStation...
            </div>
          ) : (
            models.map((m, i) => <Model3DCard key={m.id} model={m} index={i} />)
          )}
        </div>

        {/* Workflow timeline */}
        <div className="m3d-workflow fade-up">
          <h2 className="m3d-workflow-title">3D <span className="gradient-text">Workflow</span></h2>
          <div className="m3d-timeline">
            {[
              { icon: '💡', step: 'Concept', desc: 'Sketch, reference gathering, and mood board creation.' },
              { icon: '🗿', step: 'Modeling', desc: 'Base mesh → high-poly sculpt → retopology.' },
              { icon: '🎨', step: 'Texturing', desc: 'UV unwrapping, PBR materials with Substance 3D.' },
              { icon: '💡', step: 'Lighting', desc: 'HDRI setup, area lights, and volumetric atmosphere.' },
              { icon: '🎬', step: 'Render', desc: 'High-sample Cycles render with post-processing in Affinity.' },
            ].map(({ icon, step, desc }, i) => (
              <div key={step} className="m3d-timeline-item">
                <div className="m3d-tl-dot">
                  <span>{icon}</span>
                  {i < 4 && <div className="m3d-tl-line" />}
                </div>
                <h4 className="m3d-tl-step">{step}</h4>
                <p className="m3d-tl-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Software skills */}
        <div className="m3d-software fade-up">
          <h2 className="m3d-sw-title">Software <span className="gradient-text">Proficiency</span></h2>
          <div className="m3d-sw-bars">
            {software.map((sw, i) => (
              <div key={sw.name} className="m3d-sw-row">
                <div className="m3d-sw-info">
                  <span className="m3d-sw-icon">{sw.icon}</span>
                  <span className="m3d-sw-name">{sw.name}</span>
                  <span className="m3d-sw-pct">{sw.level}%</span>
                </div>
                <div className="m3d-sw-track">
                  <div
                    className="m3d-sw-fill"
                    style={{ width: animate ? `${sw.level}%` : '0%', transitionDelay: `${0.2 + i * 0.1}s` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
