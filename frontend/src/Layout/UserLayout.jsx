import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNav from '../components/UserNav'
import Footer from '../components/UserFooter'

function Userlayout() {
  return (
    <div className="layout-wrapper">
      <UserNav />
      <main className="content-wrapper">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Userlayout