import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from 'react-icons/fa'

const footerStyles = {
  footer: {
    width: '100%',
    background: 'var(--gradient-dark)',
    padding: '48px 0 24px',
    color: 'var(--color-light)'
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

function AdminFootbar() {
  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.content}>
        <div style={footerStyles.section}>
          <h3 style={footerStyles.heading}>ReMatch Admin</h3>
          <p style={{ fontSize: '0.9em' }}>
            Administrative dashboard for managing ReMatch platform and users.
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
          <h3 style={footerStyles.heading}>Management</h3>
          <ul style={footerStyles.linksList}>
            <li><Link to="/admin/users" style={footerStyles.link}>User Management</Link></li>
            <li><Link to="/admin/analytics" style={footerStyles.link}>Analytics</Link></li>
            <li><Link to="/admin/reports" style={footerStyles.link}>Reports</Link></li>
            <li><Link to="/admin/settings" style={footerStyles.link}>Settings</Link></li>
          </ul>
        </div>

        <div style={footerStyles.section}>
          <h3 style={footerStyles.heading}>Resources</h3>
          <ul style={footerStyles.linksList}>
            <li><Link to="/admin/documentation" style={footerStyles.link}>Documentation</Link></li>
            <li><Link to="/admin/api" style={footerStyles.link}>API Access</Link></li>
            <li><Link to="/admin/logs" style={footerStyles.link}>System Logs</Link></li>
            <li><Link to="/admin/backup" style={footerStyles.link}>Backups</Link></li>
          </ul>
        </div>

        <div style={footerStyles.section}>
          <h3 style={footerStyles.heading}>Support</h3>
          <ul style={footerStyles.linksList}>
            <li><Link to="/admin/help" style={footerStyles.link}>Admin Help</Link></li>
            <li><Link to="/admin/tickets" style={footerStyles.link}>Support Tickets</Link></li>
            <li><Link to="/admin/updates" style={footerStyles.link}>System Updates</Link></li>
            <li><Link to="/admin/contact" style={footerStyles.link}>Contact IT</Link></li>
          </ul>
        </div>
      </div>

      <div style={footerStyles.bottom}>
        <p>&copy; {new Date().getFullYear()} ReMatch Admin Portal. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default AdminFootbar