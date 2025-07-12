import React from 'react'
import '../style/UserNavbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUserLogin } from '../redux/userSlice'

function UserNavbarBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleUserLogout() {
    dispatch(clearUserLogin())
    navigate('/login')
  }

  return (
    <nav className="user-navbar-bar">
      <div className="user-navbar-logo">
        <svg role="img" viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
          <title>Remix</title>
          <path d="M21.511 18.508c.216 2.773.216 4.073.216 5.492H15.31c0-.309.006-.592.011-.878.018-.892.036-1.821-.109-3.698-.19-2.747-1.374-3.358-3.55-3.358H1.574v-5h10.396c2.748 0 4.122-.835 4.122-3.049 0-1.946-1.374-3.125-4.122-3.125H1.573V0h11.541c6.221 0 9.313 2.938 9.313 7.632 0 3.511-2.176 5.8-5.114 6.182 2.48.497 3.93 1.909 4.198 4.694ZM1.573 24v-3.727h6.784c1.133 0 1.379.84 1.379 1.342V24Z" />
        </svg>
      </div>
      <div className="user-navbar-links">
        <Link to="/home" className="user-navbar-link">Home</Link>
        <Link to="/how-it-works" className="user-navbar-link">How It Works</Link>
        <Link to="/about" className="user-navbar-link">About</Link>
        <Link to="/contact" className="user-navbar-link">Contact</Link>
      </div>
      <button className="user-navbar-logout" onClick={handleUserLogout}>Logout</button>
    </nav>
  )
}

export default UserNavbarBar