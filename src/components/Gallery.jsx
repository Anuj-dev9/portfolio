import { useEffect, useRef, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { fetchBehanceProjects } from '../services/behanceService'
import { behanceProjects as fallbackArtworks } from '../data/behance'
import './Gallery.css'

function useIntersect(threshold = 0.05) {
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

export default function Gallery() {
  const [artworks, setArtworks] = useState(fallbackArtworks)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Default')
  const [active, setActive] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)

  // Use intersected state
  const [sectionRef, isIntersected] = useIntersect(0.05)
  const isVisible = isIntersected ? 'visible' : ''

  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [active])


  useEffect(() => {
    async function loadProjects() {
      const liveData = await fetchBehanceProjects()
      if (liveData) {
        const galleryProjects = liveData.filter(p => p.portfolioSection === 'Gallery')
        const mappedGallery = galleryProjects.map(p => {
          let cat = 'Digital Art';
          let tags = ['Behance', 'Creative'];
          let medium = 'Digital Media';
          const t = p.title.toUpperCase();

          if (t.includes('WHISPERS') || t.includes('AUTUMN')) {
            cat = 'Concept Art';
            tags = ['Fantasy', 'Environment', 'Concept Art'];
            medium = 'Digital Painting';
          } else if (t.includes('MUSIC') || t.includes('LOST')) {
            cat = 'Illustration';
            tags = ['Character', 'Vibrant', 'Music'];
            medium = 'Photoshop';
          } else if (t.includes('CONFIDENCE') || t.includes('SOFT')) {
            cat = 'Portraiture';
            tags = ['Portrait', 'Minimal', 'Lighting'];
            medium = 'Digital Art';
          } else if (t.includes('RADHA') || t.includes('KRISHNA')) {
            cat = 'Illustration';
            tags = ['Mythology', 'Deity', 'Cultural'];
            medium = 'Procreate';
          } else if (t.includes('#DRAWING')) {
            cat = 'Sketch & Drawing';
            tags = ['Drawing', 'Line Art', 'Traditional feel'];
            medium = 'Pencil / Screen';
          }

          return {
            ...p,
            category: cat,
            tags: tags,
            medium: medium,
            year: new Date().getFullYear().toString()
          }
        });
        
        setArtworks(mappedGallery)
      }
      setLoading(false)
    }
    loadProjects()
  }, [])

  const cats = useMemo(() => {
    const uniqueCats = ['All', ...new Set(artworks.map(a => a.category))]
    return uniqueCats
  }, [artworks])

  const displayedArtworks = useMemo(() => {
    let result = filter === 'All' ? artworks : artworks.filter(a => a.category === filter)
    
    if (sortBy === 'A-Z') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'Z-A') {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title))
    }
    // 'Default' respects the original Behance chronological ordering
    return result
  }, [artworks, filter, sortBy])

  const openLightbox = (art) => {
    setActive(art)
    setActiveIdx(displayedArtworks.indexOf(art))
  }
  const navigate = (dir) => {
    const next = (activeIdx + dir + displayedArtworks.length) % displayedArtworks.length
    setActive(displayedArtworks[next])
    setActiveIdx(next)
  }

  useEffect(() => {
    const handler = (e) => {
      if (!active) return
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, activeIdx, displayedArtworks])

  return (
    <section className="section gallery-section page-enter" ref={sectionRef}>
      <div className="orb orb-gold" style={{ width:450,height:450,top:'-50px',right:'-80px' }} />
      <div className="orb orb-purple" style={{ width:400,height:400,bottom:'-50px',left:'-60px' }} />

      <div className="container">
        <div className={`section-header-center fade-in ${isVisible}`}>
          <p className="section-label">Digital Art</p>
          <h1 className="section-title">Art <span className="gradient-text-warm">Gallery</span></h1>
          <p className="section-subtitle">
            A curated collection of digital paintings, concept art, and generative artwork.
          </p>
        </div>

        {/* Filter and Sort Area */}
        <div className={`gallery-controls fade-in ${isVisible}`}>
          <div className="gallery-filters">
            {cats.map(c => (
              <button
                key={c}
                className={`fp-filter-btn ${filter === c ? 'active-warm' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="gallery-sort-wrap">
            <select 
              className="gallery-sort-select" 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="Default">Latest</option>
              <option value="A-Z">A to Z</option>
              <option value="Z-A">Z to A</option>
            </select>
          </div>
        </div>

        {/* Masonry grid */}
        {loading ? (
          <div className="gallery-loading">
            <div className="loader-ring" />
            <p>Syncing with Behance...</p>
          </div>
        ) : (
          <div className="gallery-masonry">
            {displayedArtworks.map((art, i) => (
              <div
                key={art.id}
                className={`gallery-item fade-scale gallery-item--${(i % 3) + 1} ${isVisible}`}
                style={{ transitionDelay: isVisible ? `${i * 0.07}s` : '0s' }}
                onClick={() => openLightbox(art)}
              >
                <div className="gallery-img-wrap">
                  <img src={art.img} alt={art.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-overlay">
                    <div className="gallery-overlay-content">
                      <h3 className="gallery-art-title">{art.title}</h3>
                      <span className="gallery-art-medium">{art.medium}</span>
                      <div className="gallery-art-tags">
                        {art.tags.slice(0, 3).map(t => <span key={t} className="tag tag-gold">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="gallery-item-footer">
                  <span className="gallery-item-title">{art.title}</span>
                  <span className="gallery-item-year">{art.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className={`gallery-cta fade-up ${isVisible}`}>
          <p className="gallery-cta-text">Interested in a commission or print?</p>
          <a href="/contact" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Get In Touch
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {active && createPortal(
        <div className="gallery-lightbox" onClick={() => setActive(null)}>
          <div className="gallery-lb-inner" onClick={e => e.stopPropagation()}>
            <button className="gallery-lb-close" onClick={() => setActive(null)}>✕</button>
            <button className="gallery-lb-nav gallery-lb-prev" onClick={() => navigate(-1)}>‹</button>
            <button className="gallery-lb-nav gallery-lb-next" onClick={() => navigate(1)}>›</button>
            <img src={active.img} alt={active.title} className="gallery-lb-img" />
            <div className="gallery-lb-info">
              <h3>{active.title}</h3>
              <span className="gallery-lb-meta">{active.medium} · {active.year}</span>
              <div className="gallery-lb-tags">
                {active.tags.map(t => <span key={t} className="tag tag-gold">{t}</span>)}
              </div>
              {active.behance && (
                <a href={active.behance} target="_blank" rel="noopener noreferrer" className="gallery-behance-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6zm-6 4c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zM2 13h4v1H2v-1zm0-3h4v1H2v-1zm16-4h-4v1h4V6z"/></svg>
                  View on Behance
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
        {/* Behance Link */}
        <div className={`gallery-cta fade-up ${isVisible}`} style={{marginTop: '2rem'}}>
          <p className="gallery-cta-text">Looking for more of my creative work?</p>
          <a href="https://www.behance.net/anujadhikary193" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6zm-6 4c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zM2 13h4v1H2v-1zm0-3h4v1H2v-1zm16-4h-4v1h4V6z"/></svg>
            See More on Behance
          </a>
        </div>
    </section>
  )
}
