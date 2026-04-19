import { useState, useEffect } from 'react'
import { Link, useRouter } from '../router'
import './Navbar.css'

const navLinks = [
  { label: 'Home',      to: '/',         icon: '⌂' },
  { label: 'Projects',  to: '/projects', icon: '💻' },
  { label: 'Design',    to: '/design',   icon: '🎨' },
  { label: 'Gallery',   to: '/gallery',  icon: '🖼️' },
  { label: '3D',        to: '/3d',       icon: '🧊' },
  { label: 'About',     to: '/about',    icon: '👤' },
  { label: 'Contact',   to: '/contact',  icon: '✉️' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const { path } = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [path])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-bracket">&lt;</span>
          <span className="gradient-text">Dev-9</span>
          <span className="logo-bracket">&gt;</span>
        </Link>

        {/* Desktop links */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.to}>
              <Link to={link.to} className={path === link.to ? 'active' : ''}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/contact" className="btn btn-primary nav-cta">
              Hire Me ✦
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
