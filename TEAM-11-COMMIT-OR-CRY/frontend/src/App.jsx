import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './adminPages/AdminLogin'
import AdminHome from './adminPages/AdminHome'
import AdminPrivate from './components/AdminPrivate'
import UserPrivate from './components/UserPrivate'
import AdminLayout from './Layout/AdminLayout'
import EmployeeLayout from './Layout/EmployeeLayout'
import UserSignup from './Userpages/UserSignup'
import UserLogin from './Userpages/Userlogin'
import RoleSelection from './Userpages/RoleSelection'
import Home from './Userpages/Home'
import EmployeeDashboard from './Userpages/EmployeeDashboard'
import EmployeeResults from './Userpages/EmployeeResults'
import Userlayout from './Layout/UserLayout'
import JobDescription from './Userpages/JobDescription'
import Loading from './components/Loading'
import Results from './Userpages/Results'

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

          {/* Role Selection - standalone page */}
          <Route element={<UserPrivate> <RoleSelection /> </UserPrivate>} path='/role-selection' />

          {/* Employee Routes with Employee Layout */}
          <Route element={<UserPrivate> <EmployeeLayout /> </UserPrivate>}>
            <Route element={<EmployeeDashboard />} path='/employee-dashboard' />
            <Route element={<EmployeeResults />} path='/employee-results' />
          </Route>

          {/* Recruiter Routes with User Layout */}
          <Route element={<UserPrivate> <Userlayout /> </UserPrivate>}>
            <Route element={<Home />} path='/home' />
            <Route element={<JobDescription />} path='/job-description' />
            <Route element={<Loading />} path='/loading' />
            <Route element={<Results />} path='/results' />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App