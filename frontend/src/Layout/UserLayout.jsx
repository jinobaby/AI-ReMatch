import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNav from '../components/UserNav'
import Footer from '../components/UserFooter'

function Userlayout() {
  return (
    <div>
        
        <UserNav/>

        <Outlet/>

        <Footer/>

    </div>
  )
}

export default Userlayout