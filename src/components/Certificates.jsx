import { useEffect, useRef } from 'react';
import './Certificates.css';

const certificates = [
  {
    id: 1,
    title: 'NFDC Certificate',
    issuer: 'National Film Development Corporation',
    date: '',
    credentialId: null,
    link: '/Anuj Adhikary.pdf',
    accent: '#E8A838',
  },
];

function useIntersect(cb, threshold = 0.1) {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) cb(e[0].target) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function Certificates() {
  const sectionRef = useIntersect(el =>
    el.querySelectorAll('.fade-up')
      .forEach((e, i) => setTimeout(() => e.classList.add('visible'), i * 100))
  )

  return (
    <section className="cert-section" ref={sectionRef}>
      <div className="container">
        <h2 className="cert-section-title fade-up">
          Licenses & <span className="gradient-text">Certifications</span>
        </h2>
        
        <div className="cert-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-card fade-up">
              <div className="cert-card-content">
                <div className="cert-header">
                  <h3 className="cert-title">{cert.title}</h3>
                  <span className="cert-date">{cert.date}</span>
                </div>
                <div className="cert-issuer-row">
                  <p className="cert-issuer" style={{ color: cert.accent }}>{cert.issuer}</p>
                  {cert.credentialId && (
                    <p className="cert-id">ID: {cert.credentialId}</p>
                  )}
                </div>
                
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                  View Credential
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
