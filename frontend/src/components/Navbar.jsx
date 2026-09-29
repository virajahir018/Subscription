import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className="bg-gray-900 px-6 py-4 shadow-lg mb-20">
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
                        to="/reset-password"
                        className="text-white font-semibold hover:text-blue-400 transition duration-300"
                    >
                        Reset Password
                    </Link>
                </li>

            </ul>
        </nav>
    )
}

