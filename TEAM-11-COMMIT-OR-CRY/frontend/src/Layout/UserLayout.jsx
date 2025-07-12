import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNavbarBar from '../components/UserNav'
import Footer from '../components/UserFooter'

function Userlayout() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--gradient-dark)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <UserNavbarBar />
      <main style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Userlayout