import { useEffect, useRef, useState } from 'react'
import './Skills.css'

const BALL_COLORS = ['#E8A838', '#C88820', '#C06848', '#F0C060', '#D4A040', '#B07828']

function FloatingBalls({ count = 18 }) {
  const balls = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 10 + Math.random() * 36,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 10 + Math.random() * 12,
    delay: Math.random() * -20,
    color: BALL_COLORS[i % BALL_COLORS.length],
    opacity: 0.12 + Math.random() * 0.25,
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
            boxShadow: `0 0 ${b.size * 0.5}px ${b.color}33, inset 0 -${b.size * 0.12}px ${b.size * 0.25}px rgba(0,0,0,0.3), inset 0 ${b.size * 0.08}px ${b.size * 0.15}px rgba(255,255,255,0.12)`,
          }}
        />
      ))}
    </div>
  )
}

const skillCategories = [
  {
    label: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'React / Next.js', level: 92 },
      { name: 'TypeScript', level: 85 },
      { name: 'CSS / Tailwind', level: 90 },
      { name: 'Vue.js', level: 72 },
    ],
  },
  {
    label: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js / Express', level: 88 },
      { name: 'Python / Django', level: 78 },
      { name: 'REST APIs', level: 94 },
      { name: 'GraphQL', level: 70 },
    ],
  },
  {
    label: 'Database & Cloud',
    icon: '🗄️',
    skills: [
      { name: 'MongoDB', level: 85 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'AWS / GCP', level: 72 },
      { name: 'Docker', level: 75 },
    ],
  },
]

const tools = [
  'Git & GitHub', 'VS Code', 'Figma', 'Postman', 'Jest',
  'Webpack', 'Vite', 'Linux', 'Jira', 'Vercel',
]

export default function Skills() {
  const sectionRef = useRef(null)
  const [animate, setAnimate] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setAnimate(true)
          entries[0].target.querySelectorAll('.fade-in').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 100)
          })
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" className="section skills-section" ref={sectionRef}>
      <div className="orb orb-cyan skills-orb" />
      <div className="grid-bg" />

      {/* Floating balls background */}
      <FloatingBalls count={20} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-label">My Expertise</p>
          <h2 className="section-title">Skills & <span className="gradient-text">Technologies</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A carefully curated set of technologies I use to build modern, scalable, and beautiful applications.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="skills-tabs fade-in">
          {skillCategories.map((cat, i) => (
            <button
              key={i}
              className={`skills-tab ${activeCategory === i ? 'active' : ''}`}
              onClick={() => setActiveCategory(i)}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Bars */}
        <div className="skills-panel glass-card fade-in">
          <div className="skills-bars">
            {skillCategories[activeCategory].skills.map((skill, i) => (
              <div key={skill.name} className="skill-row">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percent">{skill.level}%</span>
                </div>
                <div className="skill-bar-track">
                  <div
                    className="skill-bar-fill"
                    style={{
                      width: animate ? `${skill.level}%` : '0%',
                      transitionDelay: `${i * 0.1 + 0.2}s`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Row */}
        <div className="tools-section fade-in">
          <h3 className="tools-title">Tools & Platforms</h3>
          <div className="tools-grid">
            {tools.map((tool, i) => (
              <div key={tool} className="tool-chip" style={{ animationDelay: `${i * 0.05}s` }}>
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
