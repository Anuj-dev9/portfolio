import { useEffect, useRef } from 'react'
import { Link } from '../router'
import './About.css'

const highlights = [
  { icon:'🎓', title:'Education', desc:'B.Sc. Computer Science, University of Technology, 2021' },
  { icon:'💼', title:'Experience', desc:'3+ years building products for startups & enterprises worldwide' },
  { icon:'🌍', title:'Location', desc:'Based remotely — Available for global collaborations' },
  { icon:'🎨', title:'Disciplines', desc:'Frontend Dev · 2D Design · Digital Art · 3D Modeling' },
]

const timeline = [
  { year:'2021', role:'Junior Dev', company:'StartupXYZ', desc:'Built core UI library used across 3 products.' },
  { year:'2022', role:'UI Developer', company:'CreativeLab', desc:'Led frontend for 12 client projects.' },
  { year:'2023', role:'Senior Frontend Dev', company:'TechCorp', desc:'Architected design system serving 50k users.' },
  { year:'2024', role:'Freelance Creative Dev', company:'Self', desc:'Design, code, 3D — full creative control.' },
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
      <div className="orb orb-purple" style={{ width:500,height:500,top:'-80px',left:'-80px' }} />
      <div className="orb orb-cyan"   style={{ width:400,height:400,bottom:0,right:'-60px' }} />

      <div className="container">
        <div className="about-hero fade-in">
          <div className="about-hero-left">
            <p className="section-label">About Me</p>
            <h1 className="section-title">
              Creative developer <br/><span className="gradient-text">& digital artist</span>
            </h1>
            <p className="section-subtitle">
              I sit at the intersection of engineering and art — I build performant web applications,
              design beautiful interfaces, paint digital art, and sculpt 3D worlds. One person.
              Infinite mediums.
            </p>
            <div className="about-actions" style={{ flexWrap: 'wrap' }}>
              <a href="/resume_web.pdf" download className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Developer CV
              </a>
              <a href="/resume_design.pdf" download className="btn btn-primary" style={{ background: 'var(--blue)', borderColor: 'var(--blue)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Designer CV
              </a>
              <Link to="/contact" className="btn btn-outline">Let's Talk</Link>
            </div>
          </div>

          {/* Code card */}
          <div className="about-code-card glass-card fade-right">
            <div className="code-header">
              <div className="code-dots">
                <span style={{background:'#ff5f57'}} />
                <span style={{background:'#febc2e'}} />
                <span style={{background:'#28c840'}} />
              </div>
              <span className="code-filename">about.js</span>
            </div>
            <pre className="code-body">{`const me = {
  name: "Anuj Adhikary",
  role: [
    "Frontend Developer",
    "2D Graphic Designer",
    "Digital Artist",
    "3D Modeler",
  ],
  tools: {
    code:   ["React", "TS", "Node"],
    design: ["Figma", "PS", "AI"],
    art3d:  ["Blender", "ZBrush"],
  },
  openTo: "Everything creative 🚀",
};`}</pre>
          </div>
        </div>

        {/* Highlights grid */}
        <div className="about-highlights">
          {highlights.map((h, i) => (
            <div key={i} className="about-highlight-card glass-card fade-scale" style={{ transitionDelay: `${i*0.1}s` }}>
              <span className="about-hl-icon">{h.icon}</span>
              <h4 className="about-hl-title">{h.title}</h4>
              <p className="about-hl-desc">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Career timeline */}
        <div className="about-timeline fade-up">
          <h2 className="about-tl-title">Career <span className="gradient-text">Timeline</span></h2>
          <div className="about-tl-list">
            {timeline.map((t, i) => (
              <div key={i} className="about-tl-item fade-in" style={{ transitionDelay: `${i*0.12}s` }}>
                <div className="about-tl-year">{t.year}</div>
                <div className="about-tl-dot" />
                <div className="about-tl-content glass-card">
                  <h4 className="about-tl-role">{t.role} <span className="about-tl-company">@ {t.company}</span></h4>
                  <p className="about-tl-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun facts */}
        <div className="about-facts fade-up">
          {[
            ['☕', 'Coffee consumed', '~1,200 cups/year'],
            ['💻', 'Lines of code', '200K+'],
            ['🎨', 'Artworks created', '150+'],
            ['🌙', 'Late night sessions', 'Countless'],
          ].map(([icon, label, val]) => (
            <div key={label} className="about-fact glass-card">
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
