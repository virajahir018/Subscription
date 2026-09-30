import axios from 'axios';
import React, { useState } from 'react'

export default function ResetPassword() {
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Password and confirm password must be same");
            return;
        }

        ser

        console.log(password)
        console.log(confirmPassword)

        // try {

        //     const response = await axios.post("http://localhost:3000/user/reset-password", { otp, email })

        //     console.log(response.data)

        // } catch (error) {
        //     console.log(error.response?.data)
        // }
    }


    return (
        <div className="text-center">

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">

                <input
                    type="text"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-50 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <input
                    type="text"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-50 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />


                {error && (
                    <p className="text-red-500">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-50 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                    Send
                </button>

            </form>
        </div >
    )
}