import React from 'react'
import ForgotPassword from './ForgotPassword'
import { Route, Routes } from 'react-router-dom'
import ResetPassword from './ResetPassword'
import Home from './Home'
import Navbar from './Navbar'

export default function App() {
  return (

    <div>
      <Navbar />


      <Routes>
        <ul>
          <li><Route path='/' element={<Home />} /></li>

        </ul>
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

