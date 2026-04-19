import { useEffect, useRef, useState } from 'react'
import './Modeling3D.css'

const models = [
  {
    id: 1, title: 'Chrome Sculpture',
    desc: 'Abstract organic sculpture with reflective metallic surface. Rendered in Blender with HDRI lighting and ray-tracing.',
    img: '/images/model_3d_1.png',
    tags: ['Blender', 'Cycles', 'Abstract'],
    category: 'Abstract', polys: '2.4M', render: 'Cycles', time: '4h',
    accent: '#a855f7',
    behance: 'https://www.behance.net/gallery/198765435/Chrome-Sculpture',
  },
  {
    id: 2, title: 'Neon Landscape',
    desc: 'Futuristic low-poly terrain with glowing grid lines, volumetric fog, and a stylized game-art aesthetic.',
    img: '/images/model_3d_2.png',
    tags: ['Blender', 'EEVEE', 'Stylized'],
    category: 'Environment', polys: '890K', render: 'EEVEE', time: '2h',
    accent: '#06b6d4',
    behance: 'https://www.behance.net/gallery/198765436/Neon-Landscape',
  },
  {
    id: 3, title: 'Concept Helmet',
    desc: 'Sci-fi helmet concept with holographic visor, matte/chrome material study, and cinematic product lighting.',
    img: '/images/model_3d_3.png',
    tags: ['Blender', 'Substance', 'Hard Surface'],
    category: 'Character', polys: '3.1M', render: 'Cycles', time: '6h',
    accent: '#ec4899',
    behance: 'https://www.behance.net/gallery/198765437/Concept-Helmet',
  },
]

const software = [
  { name: 'Blender', level: 88, icon: '🔷' },
  { name: 'Cinema 4D', level: 72, icon: '🎬' },
  { name: 'ZBrush', level: 65, icon: '🗿' },
  { name: 'Substance 3D', level: 78, icon: '🎨' },
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
        {model.behance && (
          <a href={model.behance} target="_blank" rel="noopener noreferrer" className="m3d-behance-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6zm-6 4c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zM2 13h4v1H2v-1zm0-3h4v1H2v-1zm16-4h-4v1h4V6z"/></svg>
            View on Behance
          </a>
        )}
      </div>
      <div className="m3d-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${model.accent}30, transparent 70%)` }} />
    </div>
  )
}

export default function Modeling3D() {
  const [animate, setAnimate] = useState(false)

  const sectionRef = useIntersect(el => {
    setAnimate(true)
    el.querySelectorAll('.fade-in,.fade-up,.fade-scale,.fade-left,.fade-right')
      .forEach((e, i) => setTimeout(() => e.classList.add('visible'), i * 80))
  })

  return (
    <section className="section m3d-section page-enter" ref={sectionRef}>
      <div className="orb orb-cyan"   style={{ width:500,height:500,top:'-80px',right:'-80px' }} />
      <div className="orb orb-purple" style={{ width:450,height:450,bottom:0,left:'-80px' }} />
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
          {models.map((m, i) => <Model3DCard key={m.id} model={m} index={i} />)}
        </div>

        {/* Workflow timeline */}
        <div className="m3d-workflow fade-up">
          <h2 className="m3d-workflow-title">3D <span className="gradient-text">Workflow</span></h2>
          <div className="m3d-timeline">
            {[
              { icon:'💡', step:'Concept', desc:'Sketch, reference gathering, and mood board creation.' },
              { icon:'🗿', step:'Modeling', desc:'Base mesh → high-poly sculpt → retopology.' },
              { icon:'🎨', step:'Texturing', desc:'UV unwrapping, PBR materials with Substance 3D.' },
              { icon:'💡', step:'Lighting', desc:'HDRI setup, area lights, and volumetric atmosphere.' },
              { icon:'🎬', step:'Render', desc:'High-sample Cycles render with post-processing in Affinity.' },
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
                    style={{ width: animate ? `${sw.level}%` : '0%', transitionDelay: `${0.2 + i*0.1}s` }}
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
