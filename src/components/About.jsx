import { useEffect, useRef } from 'react'
import { Link } from '../router'
import './About.css'

const BALL_COLORS = ['#E8A838', '#C88820', '#F0C060', '#C06848', '#D4A040', '#B07828']

function FloatingBalls({ count = 20 }) {
  const balls = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 14 + Math.random() * 44,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 8 + Math.random() * 14,
    delay: Math.random() * -20,
    color: BALL_COLORS[i % BALL_COLORS.length],
    opacity: 0.15 + Math.random() * 0.35,
  }))

  return (
    <div className="floating-balls">
      {balls.map(b => (
        <div
          key={b.id}
          className="floating-ball"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: `radial-gradient(circle at 35% 35%, ${b.color}dd, ${b.color}66, ${b.color}22)`,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            boxShadow: `0 0 ${b.size * 0.6}px ${b.color}33, inset 0 -${b.size * 0.15}px ${b.size * 0.3}px rgba(0,0,0,0.3), inset 0 ${b.size * 0.1}px ${b.size * 0.2}px rgba(255,255,255,0.15)`,
          }}
        />
      ))}
    </div>
  )
}

const highlights = [
  { icon: '🎓', title: 'Education', desc: 'BCA, Amity University, 2026' },
  { icon: '💼', title: 'Experience', desc: '1+ year in freelancing' },
  { icon: '🌍', title: 'Location', desc: 'Based remotely — Available for global collaborations' },
  { icon: '🎨', title: 'Disciplines', desc: 'Frontend Dev · 2D Design · Digital Art · 3D Modeling' },
]

const timeline = [
  { year: '2024', role: 'Freelance Creative Dev', company: 'Self' }
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

export default function About() {
  const sectionRef = useIntersect(el =>
    el.querySelectorAll('.fade-in,.fade-up,.fade-left,.fade-right,.fade-scale')
      .forEach((e, i) => setTimeout(() => e.classList.add('visible'), i * 90))
  )

  return (
    <section className="section about-section page-enter" ref={sectionRef}>
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: '-80px', left: '-80px' }} />
      <div className="orb orb-cyan" style={{ width: 400, height: 400, bottom: 0, right: '-60px' }} />

      {/* Floating balls background */}
      <FloatingBalls count={25} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="about-hero fade-in">
          <div className="about-hero-left">
            <p className="section-label">About Me</p>
            <h1 className="section-title">
              Creative developer <br /><span className="gradient-text">& digital artist</span>
            </h1>
            <p className="section-subtitle">
              I sit at the intersection of engineering and art — I build performant web applications,
              design beautiful interfaces, paint digital art, and sculpt 3D worlds. One person.
              Infinite mediums.
            </p>
            <div className="about-actions" style={{ flexWrap: 'wrap' }}>
              <a href="/resume_web.pdf" download className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Developer CV
              </a>
              <a href="/resume_design.pdf" download className="btn btn-primary" style={{ background: 'var(--blue)', borderColor: 'var(--blue)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Designer CV
              </a>
              <Link to="/contact" className="btn btn-outline">Let's Talk</Link>
            </div>
          </div>
          <div className="about-hero-right fade-in">
            <div className="about-code glass-card">
              <div className="code-dots">
                <span style={{ background: '#ff5f57' }} />
                <span style={{ background: '#febc2e' }} />
                <span style={{ background: '#28c840' }} />
                <span className="code-filename">about.js</span>
              </div>
              <pre className="code-block"><code>{`const me = {
  name: "Anuj Adhikary",
  role: [
    "Frontend Developer",
    "2D Graphic Designer",
    "Digital Artist",
    "3D Modeler",
  ],
  tools: {
    code:   ["React", "JavaScript", "CSS", "HTML"],
    design: ["Figma", "Photoshop", "Illustrator"],
    art3d:  ["3ds Max", "Maya"],
  },
  openTo: "Everything creative 🚀",
};`}</code></pre>
            </div>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="about-highlights fade-up">
          {highlights.map(h => (
            <div key={h.title} className="about-highlight-card">
              <span className="about-hl-icon">{h.icon}</span>
              <h3 className="about-hl-title">{h.title}</h3>
              <p className="about-hl-desc">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="about-timeline fade-up">
          <h2 className="about-tl-title">
            Career <span className="gradient-text">Timeline</span>
          </h2>
          <div className="about-tl-list">
            {timeline.map(t => (
              <div key={t.year} className="about-tl-item">
                <span className="about-tl-dot" />
                <span className="about-tl-year">{t.year}</span>
                <div className="about-tl-content">
                  <div className="about-tl-role">{t.role}</div>
                  <div className="about-tl-company">@ {t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun facts */}
        <div className="about-facts fade-up">
          {[
            ['☕', 'Coffee consumed', '~1,000 cups/year'],
            ['💻', 'Lines of code', '100K+'],
            ['🎨', 'Artworks created', '20+'],
            ['🌙', 'Late night sessions', 'Countless'],
          ].map(([icon, label, val]) => (
            <div key={label} className="about-fact">
              <span className="about-fact-icon">{icon}</span>
              <span className="about-fact-val gradient-text">{val}</span>
              <span className="about-fact-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
