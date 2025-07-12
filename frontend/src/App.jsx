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
import JobDescription from './Userpages/JobDescription'
import Loading from './components/Loading' // <-- Import your loading page

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path='/Admin-login' element={<AdminLogin />} />
          <Route element={<AdminPrivate> <AdminLayout /> </AdminPrivate>}>
            <Route element={<AdminHome />} path='/Admin' />
          </Route>
          <Route path='/Signup' element={<UserSignup />} />
          <Route path='/Login' element={<UserLogin />} />
          <Route element={<UserPrivate> <Userlayout/> </UserPrivate>}>
            <Route element={<Home/>} path='/home'/>
            <Route element={<JobDescription />} path='/job-description' />
            <Route element={<Loading />} path='/loading' />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App