import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNavbarBar from '../components/UserNav'
import Footer from '../components/UserFooter'
import '../style/EmployeeLayout.css'

function EmployeeLayout() {
  return (
    <div className="employee-layout">
      {/* Animated background elements */}
      <div className="employee-background-shapes">
        <div className="employee-shape employee-shape-1"></div>
        <div className="employee-shape employee-shape-2"></div>
        <div className="employee-shape employee-shape-3"></div>
      </div>

      <UserNavbarBar />
      <main className="employee-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default EmployeeLayout
