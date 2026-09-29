import axios from 'axios';
import React, { useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [otp, setOtp] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post("http://localhost:3000/user/reset-password", { otp, email })

            console.log(response.data)

        } catch (error) {
            console.log(error.response?.data)
        }
    }

    console.log(location)

    return (
        <div className="text-center">

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder='Enter OTP'
                    maxLength={6}
                    inputMode='numeric'
                    className="w-50 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mr-5"
                    onChange={(e) => setOtp(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-20 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </form>
        </div >
    )
}