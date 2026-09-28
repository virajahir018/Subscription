import { useState } from "react";
import axios from "axios";

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:3000/user/forgot-password",
                {
                    email: email
                }
            );

            console.log(response.data);

        } catch (error) {
            console.log(error.response?.data);
        }
    };


    return (
        <div>

            <h2>Forgot Password</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit">
                    Send
                </button>

            </form>

        </div>
    );
}

export default ForgotPassword;