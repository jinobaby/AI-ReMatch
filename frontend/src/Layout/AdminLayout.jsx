import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
import AdminFootbar from '../components/AdminFootbar'

function AdminLayout() {
  return (
    <div>
      <AdminNavbar />
      
      <Outlet />
      
      <AdminFootbar />
    </div>
  )
}

export default AdminLayout
