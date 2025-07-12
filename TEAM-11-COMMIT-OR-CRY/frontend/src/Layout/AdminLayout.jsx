import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbarBar from '../components/AdminNavbar'
import AdminFootbar from '../components/AdminFootbar'

function AdminLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--gradient-dark)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AdminNavbarBar />
      <main style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </main>
      <AdminFootbar />
    </div>
  )
}

export default AdminLayout
