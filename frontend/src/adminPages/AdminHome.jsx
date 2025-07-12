
import React from 'react'
import AdminNavbar from '../components/AdminNavbar'
import AdminFootbar from '../components/AdminFootbar'

function AdminHome() {
  return (
    <div className='admin-home' style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2.2em', color: '#412D6D', marginBottom: '0.5em' }}>Admin Home</h1>
        <p style={{ color: '#6c5a99', fontSize: '1.1em' }}>Welcome to the admin dashboard.</p>
      </main>
      <AdminFootbar />
    </div>
  )
}

export default AdminHome