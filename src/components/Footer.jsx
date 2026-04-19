import { Link } from '../router'
import './Footer.css'

const socials = [
  { label: 'Behance', href: 'https://www.behance.net/anujadhikary193', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6 6-2.686 6-6zm-6 4c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zM2 13h4v1H2v-1zm0-3h4v1H2v-1zm16-4h-4v1h4V6z" /></svg> },
  { label: 'GitHub', href: 'https://github.com/Anuj-dev9', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anuj-adhikary-0026502a8/', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
  { label: 'ArtStation', href: 'https://anuj_adhikary.artstation.com/', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.016 1.77L2.4 18.42h5.5l9.6-16.65h-5.484zM16.148 5.6L12.18 12.5H2.4l9.78-16.9h3.968zM21.6 18.42H13.6l7.984-13.84L21.6 18.42z" /></svg> },
]

const navCols = [
  {
    heading: 'Work',
    links: [
      { label: 'Frontend Projects', to: '/projects' },
      { label: '2D Design', to: '/design' },
      { label: 'Digital Gallery', to: '/gallery' },
      { label: '3D Modeling', to: '/3d' },
    ],
  },
  {
    heading: 'Me',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Developer Resume', href: '/resume_web.pdf' },
      { label: 'Designer Resume', href: '/resume_design.pdf' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="divider" />
      <div className="container footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span style={{ color: 'var(--purple)' }}>&lt;</span>
            <span className="gradient-text">Dev-9</span>
            <span style={{ color: 'var(--purple)' }}>&gt;</span>
          </Link>
          <p className="footer-tagline">
            Frontend engineer · 2D designer · Digital artist · 3D modeler. Building the web, one pixel and polygon at a time.
          </p>
          <div className="footer-socials">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="footer-social" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {navCols.map(col => (
          <div key={col.heading} className="footer-nav-col">
            <h4 className="footer-nav-heading">{col.heading}</h4>
            <ul className="footer-nav-list">
              {col.links.map(l => (
                <li key={l.label}>
                  {l.to
                    ? <Link to={l.to}>{l.label}</Link>
                    : <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  }
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* CTA */}
        <div className="footer-cta">
          <h4 className="footer-nav-heading">Let's create together</h4>
          <p className="footer-cta-text">Open to freelance, full-time, or just a great conversation.</p>
          <a href="mailto:hello@anujadhikary.com" className="btn btn-primary footer-cta-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Say Hello 👋
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">© {new Date().getFullYear()} Anuj Adhikary · Made with React & ❤️</p>
          <Link to="/" className="footer-back-top" aria-label="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
          </Link>
        </div>
      </div>
    </footer>
  )
}
