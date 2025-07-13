import React from 'react'
import '../style/UserNavbar.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserLogin } from '../redux/userSlice'

function UserNavbarBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const userRole = useSelector(state => state.UserLogin?.userRole || null)

  function handleUserLogout() {
    dispatch(clearUserLogin())
    navigate('/login')
  }

  // Define navigation links based on role
  const getNavigationLinks = () => {
    if (userRole === 'employee') {
      return [
        { path: '/employee-dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/role-selection', label: 'Switch Role', icon: '🔄' }
      ]
    } else if (userRole === 'recruiter') {
      return [
        { path: '/home', label: 'Upload-Area', icon: '🏠' },
        { path: '/role-selection', label: 'Switch Role', icon: '🔄' }
      ]
    } else {
      // Default links when role is not set
      return [
        { path: '/employee-dashboard', label: 'Upload-Area', icon: '🏠' },
        { path: '/role-selection', label: 'Choose Role', icon: '👤' }
      ]
    }
  }

  const navigationLinks = getNavigationLinks()
  const currentPath = location.pathname

  return (
    <nav className="user-navbar-bar">
      <div className="user-navbar-logo">
        <Link to={userRole === 'employee' ? '/employee-dashboard' : '/home'} className="logo-link">
          <svg role="img" fill='#f4ebff' viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
            <title>ReMatch</title>
            <path d="M21.511 18.508c.216 2.773.216 4.073.216 5.492H15.31c0-.309.006-.592.011-.878.018-.892.036-1.821-.109-3.698-.19-2.747-1.374-3.358-3.55-3.358H1.574v-5h10.396c2.748 0 4.122-.835 4.122-3.049 0-1.946-1.374-3.125-4.122-3.125H1.573V0h11.541c6.221 0 9.313 2.938 9.313 7.632 0 3.511-2.176 5.8-5.114 6.182 2.48.497 3.93 1.909 4.198 4.694ZM1.573 24v-3.727h6.784c1.133 0 1.379.84 1.379 1.342V24Z" />
          </svg>
          <span className="logo-text">ReMatch</span>
        </Link>
      </div>
      
      <div className="user-navbar-center">
        {userRole && (
          <div className="role-indicator">
            <span className="role-badge">
              {userRole === 'employee' ? '👤 Employee' : '👥 Recruiter'}
            </span>
          </div>
        )}
      </div>

      <div className="user-navbar-links">
        {navigationLinks.map((link, index) => (
          <Link 
            key={index}
            to={link.path} 
            className={`user-navbar-link ${currentPath === link.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
      
      <button className="user-navbar-logout" onClick={handleUserLogout}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
        </svg>
        Logout
      </button>
    </nav>
  )
}

export default UserNavbarBar