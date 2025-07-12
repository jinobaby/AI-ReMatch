import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './adminPages/AdminLogin'
import AdminHome from './adminPages/AdminHome'
import AdminPrivate from './components/AdminPrivate'
import UserPrivate from './components/UserPrivate'
import AdminLayout from './Layout/AdminLayout'
import UserSignup from './Userpages/UserSignup'
import UserLogin from './Userpages/Userlogin'
import Home from './Userpages/Home'
import Userlayout from './Layout/UserLayout'

function App() {

  return (
    <div>

      <Router>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/Login" replace />} />

          {/* Admin Public Route */}
          <Route path='/Admin-login' element={<AdminLogin />} />

          {/* Admin Private route */}
          <Route element={<AdminPrivate> <AdminLayout /> </AdminPrivate>}>

            <Route element={<AdminHome />} path='/Admin' />
            
          </Route>

          {/* User Public Login */}
          <Route path='/Signup' element={<UserSignup />} />
          <Route path='/Login' element={<UserLogin />} />

          {/* User Private */}
          <Route element={<UserPrivate> <Userlayout/> </UserPrivate>}>

          <Route element={<Home/>} path='/home'/>
          

          </Route>

        </Routes>
      </Router>

    </div>
  )
}

export default App