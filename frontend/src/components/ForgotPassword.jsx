import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:3000/user/forgot-password",
                {
                    email
                },
                {
                    withCredentials: true
                }
            );

            console.log(response.data);

            navigate("/verify-otp")


        } catch (error) {
            console.log(error.response?.data);
        }
    };


    return (
        <div className="text-center">

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-50 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mt-5 mr-5"
                />

                <button
                    type="submit"
                    className="w-20 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                    Send
                </button>

            </form>

        </div>
    );
}

export default ForgotPassword;