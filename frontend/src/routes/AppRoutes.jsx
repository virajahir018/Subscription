import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ForgotPassword from '../components/ForgotPassword'
import ResetPassword from '../components/ResetPassword'
import VerifyOTP from '../components/VerifyOTP'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/verify-otp' element={<VerifyOTP />} />
        </Routes>
    )
}
