import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ForgotPassword from '../components/ForgotPassword'
import ResetPassword from '../components/ResetPassword'
import VerifyOTP from '../components/VerifyOTP'
import Userlogin from '../components/Userlogin'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/verify-otp' element={<VerifyOTP />} />
            <Route path='/user-login' element={<Userlogin />} />
        </Routes>
    )
}
