import { useEffect, useRef, useState } from 'react'
import { fetchGithubProjects } from '../services/githubService'
import './Projects.css'

const projects = [
  {
    id: 'bng-1',
    title: 'BNG Design Studio',
    description: 'A modern, responsive design studio website focusing on sleek UI interactions and seamless user experiences.',
    tags: ['React', 'CSS', 'Vite'],
    category: 'Full Stack',
    color: '#ec4899',
    icon: '✨',
    links: { live: 'https://www.bngdesignstudio.com/', github: null },
    featured: true,
  }
]

const categories = ['All', 'Full Stack', 'AI / ML', 'Productivity', 'Data Viz', 'Mobile', 'DevOps']

export default function Projects() {
  const sectionRef = useRef(null)
  const [filter, setFilter] = useState('All')
  const [allProjects, setAllProjects] = useState(projects)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          entries[0].target.querySelectorAll('.fade-in').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 80)
          })
        }
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const uniqueCats = ['All', ...new Set(allProjects.map(p => p.category))]
  const filtered = filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter)

  return (
    <section id="projects" className="section projects-section" ref={sectionRef}>
      <div className="orb orb-pink projects-orb" />
      <div className="container">
        <div className="section-header fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="section-label">My Work</p>
          <h2 className="section-title">Featured <span className="gradient-text">Projects</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A selection of projects I've built — from startups to enterprise solutions.
          </p>
        </div>

        {/* Filter */}
        <div className="projects-filter fade-in">
          {uniqueCats.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`project-card glass-card fade-in visible ${project.featured ? 'featured' : ''}`}
              style={{ '--card-color': project.color, animationDelay: `${i * 0.1}s` }}
            >
              {project.featured && <div className="featured-badge">⭐ Featured</div>}
              {project.isGithub && <div className="featured-badge" style={{background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)'}}>Dev-9</div>}

              <div className="project-icon-wrapper" style={{ background: `${project.color}18` }}>
                <span className="project-icon">{project.icon}</span>
              </div>

              <div className="project-meta">
                <span className="project-category" style={{ color: project.color }}>{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
              </div>

              <div className="project-tags">
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div className="project-links">
                <a href={project.links.live} className="project-link project-link-live">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                  Live Demo
                </a>
                {project.links.github && project.links.github !== '#' && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="project-link project-link-github">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Source
                  </a>
                )}
              </div>

              <div className="card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${project.color}20, transparent 70%)` }} />
            </div>
          ))}
        </div>

        <div className="projects-footer fade-in">
          <a href="https://github.com/Anuj-dev9" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            View All on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
