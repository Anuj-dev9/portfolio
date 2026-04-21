import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import './Contact.css'

const contactInfo = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'anujadhikary193@gmail.com',
    href: 'mailto:anujadhikary193@gmail.com',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
    label: 'LinkedIn',
    value: 'linkedin.com/in/anujadhikary193',
    href: 'https://linkedin.com/in/anujadhikary193',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0012 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    label: 'GitHub',
    value: 'github.com/Anuj-dev9',
    href: 'https://github.com/Anuj-dev9',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.977 12.02s0-3.367-2.677-3.367H17.84v6.733h3.46s2.677 0 2.677-3.366zm-5.46 2.06v-4.12h1.164c1.165 0 1.165 4.12 0 4.12h-1.164zm-14.475 1.306s0 2.062 1.94 2.062h3.15V9.167h-3.46C4.464 9.167 4.04 11.23 4.04 11.23l2.812.304s.425-1.306 1.7-.109v1.63c-1.38.109-1.93.978-2.51 1.305s-2.002.327-2c1.033z" />
      </svg>
    ),
    label: 'Behance',
    value: 'behance.net/anujadhikary193',
    href: 'https://www.behance.net/anujadhikary193',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Location',
    value: 'Bongaigaon, Assam, India',
    href: null,
  },
]

export default function Contact() {
  const sectionRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [status, setStatus] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          entries[0].target.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 100)
          })
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await emailjs.send(
        'service_qajdlxi',
        'template_qd7uqv4',
        {
          ...formData,
          time: new Date().toLocaleString()
        },
        '-TCwDgXWc52o3IPPk'
      )

      if (response.status === 200) {
        setStatus('sent')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus(null), 4000)
      } else {
        setStatus('error')
      }

    } catch (err) {
      console.log(err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section contact-section" ref={sectionRef}>
      <div className="orb orb-purple contact-orb-1" />
      <div className="orb orb-cyan contact-orb-2" />

      <div className="container">
        <div className="section-header fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Let's <span className="gradient-text">Work Together</span></h2>
          <p className="section-subtitle">
            Have a project in mind? I'd love to hear about it.
          </p>
        </div>

        <div className="contact-grid">

          {/* LEFT SIDE */}
          <div className="contact-info fade-in-left">
            <h3 className="contact-info-title">Contact Information</h3>
            <p className="contact-info-text">
              I'm currently open to freelance projects, full-time positions, and collaborations.
              Reach out through any of these channels!
            </p>

            <div className="contact-items">
              {contactInfo.map((item, i) => (
                <div key={i} className="contact-item glass-card">
                  <div className="contact-item-icon">{item.icon}</div>
                  <div>
                    <p className="contact-item-label">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="contact-item-value" target="_blank" rel="noopener noreferrer">
                        {item.value}
                      </a>
                    ) : (
                      <span className="contact-item-value">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="contact-form-wrapper fade-in-right">
            <div className="availability-badge">
              <span className="badge-dot" />
              <span>Currently available for new projects</span>
            </div>
            <form className="contact-form glass-card" onSubmit={handleSubmit}>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input name="subject" value={formData.subject} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows="6" value={formData.message} onChange={handleChange} required />
              </div>

              <button className="btn btn-primary contact-submit" type="submit" disabled={status === 'sending'}>
                {status === 'sending' && 'Sending...'}
                {status === 'sent' && '✅ Message Sent!'}
                {status === 'error' && '❌ Failed'}
                {!status && 'Send Message'}
              </button>

              {status === 'sent' && (
                <p style={{ color: 'lightgreen', marginTop: '10px' }}>
                  🎉 Your message has been sent successfully!
                </p>
              )}

              {status === 'error' && (
                <p style={{ color: 'red', marginTop: '10px' }}>
                  ❌ Failed to send
                </p>
              )}

            </form>
          </div>

        </div>
      </div>
    </section>
  )
}