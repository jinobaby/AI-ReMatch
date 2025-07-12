import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from 'react-icons/fa'

const footerStyles = {
  footer: {
    width: '100%',
    background: 'var(--gradient-dark)',
    padding: '48px 0 24px',
    color: 'var(--color-light)',
    position: 'relative',
    bottom: 0
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '48px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  heading: {
    color: 'var(--color-purple-light)',
    fontSize: '1.2em',
    fontWeight: 600,
    marginBottom: '8px'
  },
  linksList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  link: {
    color: 'var(--color-light)',
    textDecoration: 'none',
    fontSize: '0.9em',
    transition: 'color 0.2s'
  },
  social: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px'
  },
  bottom: {
    marginTop: '48px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(199, 153, 253, 0.2)',
    textAlign: 'center',
    fontSize: '0.9em',
    color: 'var(--color-purple-light)'
  }
}

function Footer() {
  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.content}>
        <div style={footerStyles.section}>
          <h3 style={footerStyles.heading}>ReMatch</h3>
          <p style={{ fontSize: '0.9em' }}>
            Optimizing your resume with AI-powered insights and job matching technology.
          </p>
          <div style={footerStyles.social}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
               style={{ ...footerStyles.link, ':hover': { color: 'var(--color-purple-light)' }}}>
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
               style={{ ...footerStyles.link, ':hover': { color: 'var(--color-purple-light)' }}}>
              <FaLinkedin size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
               style={{ ...footerStyles.link, ':hover': { color: 'var(--color-purple-light)' }}}>
              <FaTwitter size={20} />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" 
               style={{ ...footerStyles.link, ':hover': { color: 'var(--color-purple-light)' }}}>
              <FaDiscord size={20} />
            </a>
          </div>
        </div>

        <div style={footerStyles.section}>
          <h3 style={footerStyles.heading}>Resources</h3>
          <ul style={footerStyles.linksList}>
            <li><Link to="/blog" style={footerStyles.link}>Blog</Link></li>
            <li><Link to="/guides" style={footerStyles.link}>Resume Guides</Link></li>
            <li><Link to="/templates" style={footerStyles.link}>Templates</Link></li>
            <li><Link to="/examples" style={footerStyles.link}>Examples</Link></li>
          </ul>
        </div>

        <div style={footerStyles.section}>
          <h3 style={footerStyles.heading}>Company</h3>
          <ul style={footerStyles.linksList}>
            <li><Link to="/about" style={footerStyles.link}>About Us</Link></li>
            <li><Link to="/careers" style={footerStyles.link}>Careers</Link></li>
            <li><Link to="/contact" style={footerStyles.link}>Contact</Link></li>
            <li><Link to="/privacy" style={footerStyles.link}>Privacy Policy</Link></li>
          </ul>
        </div>

        <div style={footerStyles.section}>
          <h3 style={footerStyles.heading}>Support</h3>
          <ul style={footerStyles.linksList}>
            <li><Link to="/help" style={footerStyles.link}>Help Center</Link></li>
            <li><Link to="/faq" style={footerStyles.link}>FAQ</Link></li>
            <li><Link to="/terms" style={footerStyles.link}>Terms of Service</Link></li>
            <li><Link to="/status" style={footerStyles.link}>System Status</Link></li>
          </ul>
        </div>
      </div>

      <div style={footerStyles.bottom}>
        <p>&copy; {new Date().getFullYear()} ReMatch. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer