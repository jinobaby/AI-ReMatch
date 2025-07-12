import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbarBar from '../components/AdminNavbar'
import AdminFootbar from '../components/AdminFootbar'

function AdminLayout() {
  return (
    <div className="layout-wrapper">
      <AdminNavbarBar />
      <main className="content-wrapper">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <AdminFootbar />
    </div>
  )
}

export default AdminLayout
