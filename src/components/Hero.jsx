import { useEffect, useState } from 'react'
import { Link } from '../router'
import { TypeAnimation } from 'react-type-animation'
import { fetchGithubProjects } from '../services/githubService'
import { fetchBehanceProjects } from '../services/behanceService'
import { fetchArtstationProjects } from '../services/artstationService'
import DotGrid from './DotGrid'
import './Hero.css'

export default function Hero() {
  const [projectCount, setProjectCount] = useState('..')

  useEffect(() => {
    async function hydrateProjects() {
      try {
        const [githubSync, behanceSync, artstationSync] = await Promise.all([
          fetchGithubProjects('Anuj-dev9'),
          fetchBehanceProjects(),
          fetchArtstationProjects()
        ])

        let count = 1 // 1 for BNG static project
        if (githubSync && githubSync.length) count += githubSync.length
        if (behanceSync && behanceSync.length) count += behanceSync.length
        if (artstationSync && artstationSync.length) count += artstationSync.length

        setProjectCount(`${count}+`)
      } catch (err) {
        setProjectCount('20+')
      }
    }
    hydrateProjects()
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-canvas" style={{ pointerEvents: 'auto' }}>
        <DotGrid activeColor="#E8A838" baseColor="#555555" proximity={250} />
      </div>
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
            <a href="https://anuj_adhikary.artstation.com/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{borderColor: 'var(--purple)', color: 'var(--purple)'}}>
              View ArtStation
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
              <img src="/Untitled-1.png" alt="Anuj Adhikary" className="avatar-img" />
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
