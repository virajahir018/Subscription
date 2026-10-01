import React from 'react'
import { Link } from 'react-router-dom'
import { FaBeer, FaHome, FaUser, FaUserAlt } from "react-icons/fa";

export default function Navbar() {
    
    return (
        <nav className="flex justify-between bg-gray-900 px-6 py-4 shadow-lg mb-20">
            <ul className="flex items-center justify-center gap-8">
                <li>
                    <Link
                        to="/"
                        className="text-white font-semibold hover:text-blue-400 transition duration-300"
                    >
                        Home
                    </Link>
                </li>

                <li>
                    <Link
                        to="/forgot-password"
                        className="text-white font-semibold hover:text-blue-400 transition duration-300"
                    >
                        Forgot Password
                    </Link>
                </li>

                <li>
                    <Link
                        to="/verify-otp"
                        className="text-white font-semibold hover:text-blue-400 transition duration-300"
                    >
                        Verify OTP
                    </Link>
                </li>

                <li>
                    <Link
                        to="/reset-password"
                        className="text-white font-semibold hover:text-blue-400 transition duration-300"
                    >
                        Reset Password
                    </Link>
                </li>

                <li>

                </li>
            </ul>

            <Link to="/user-login">
                <FaUserAlt className='text-white font-semibold hover:text-blue-400 transition duration-300' />
            </Link>
        </nav>
    )
}

