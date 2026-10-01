import axios from 'axios';
import React, { useState } from 'react'

export default function Userlogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function Login(e) {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/user/login",
                { email, password },
                { withCredentials: true }
            );

            console.log(response.data);
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    return (
        <div>
            <form onSubmit={Login} className='flex flex-col gap-5 items-center'>

                <input
                    type="email"
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-60 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <input
                    type="password"
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-60 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <button
                    type="submit"
                    className="w-60 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </form>
        </div>
    )
}
