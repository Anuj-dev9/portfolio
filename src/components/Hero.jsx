import { useEffect, useRef, useState } from 'react'
import { Link } from '../router'
import { TypeAnimation } from 'react-type-animation'
import { fetchGithubProjects } from '../services/githubService'
import { fetchBehanceProjects } from '../services/behanceService'
import './Hero.css'

export default function Hero() {
  const canvasRef = useRef(null)
  const [projectCount, setProjectCount] = useState('..')

  useEffect(() => {
    async function hydrateProjects() {
      try {
        const [githubSync, behanceSync] = await Promise.all([
          fetchGithubProjects('Anuj-dev9'),
          fetchBehanceProjects()
        ])

        let count = 1 // 1 for BNG static project
        if (githubSync && githubSync.length) count += githubSync.length
        if (behanceSync && behanceSync.length) count += behanceSync.length

        setProjectCount(`${count}+`)
      } catch (err) {
        setProjectCount('20+')
      }
    }
    hydrateProjects()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, particles = []

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.8 + 0.3
        this.vx = (Math.random() - 0.5) * 0.35
        this.vy = (Math.random() - 0.5) * 0.35
        this.opacity = Math.random() * 0.55 + 0.1
        this.color = ['168,85,247', '6,182,212', '236,72,153'][Math.floor(Math.random() * 3)]
      }
      update() {
        this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`
        ctx.fill()
      }
    }

    for (let i = 0; i < 110; i++) particles.push(new Particle())

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - d / 110)})`
          ctx.lineWidth = 0.5; ctx.stroke()
        }
      }))
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="hero" id="home">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse" />
            Available for Work
          </div>

          <h1 className="hero-title">
            Hi, I'm <br />
            <span className="gradient-text hero-name">Anuj Adhikary</span>
          </h1>

          <div className="hero-typewriter">
            <span className="typewriter-prefix">I create </span>
            <TypeAnimation
              sequence={[
                'Frontend Magic', 2000,
                '2D Graphic Art', 2000,
                'Digital Galleries', 2000,
                '3D Experiences', 2000,
                'Beautiful UIs', 2000,
              ]}
              wrapper="span"
              speed={48}
              repeat={Infinity}
              className="typewriter-text"
            />
          </div>

          <p className="hero-description">
            A creative developer & digital artist crafting immersive web experiences,
            bold graphic designs, and stunning 3D visuals. Where code meets art.
          </p>

          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              Explore Work
            </Link>
            <a href="https://www.behance.net/anujadhikary193" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              View Behance
            </a>
          </div>

          <div className="hero-stats">
            {[[projectCount, 'Projects'], ['Fresher'], ['4', 'Disciplines'], ['5+', 'Clients']].map(([n, l]) => (
              <div key={l} className="hero-stat">
                <span className="stat-num gradient-text">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-avatar-wrap">
            <div className="hero-avatar-ring" />
            <div className="hero-avatar-ring ring-2" />
            <div className="hero-avatar">
              <svg viewBox="0 0 200 200" className="avatar-svg">
                <defs>
                  <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="100" fill="url(#ag)" opacity="0.15" />
                <circle cx="100" cy="78" r="34" fill="url(#ag)" opacity="0.85" />
                <ellipse cx="100" cy="158" rx="54" ry="40" fill="url(#ag)" opacity="0.65" />
              </svg>
              <span className="avatar-initials">AA</span>
            </div>
          </div>

          <div className="float-cards">
            {[
              { icon: '⚛️', label: 'React', top: '0%', left: '-18%', delay: '0s' },
              { icon: '🎨', label: 'Design', top: '12%', right: '-18%', delay: '0.6s' },
              { icon: '🚀', label: '3d', bottom: '15%', right: '-15%', delay: '0.9s' },
            ].map(({ icon, label, delay, ...pos }) => (
              <div key={label} className="float-card" style={{ ...pos, animationDelay: delay }}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-cue">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll</span>
      </div>
    </section>
  )
}
