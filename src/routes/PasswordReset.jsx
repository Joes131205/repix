import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebase";

import { toast, Bounce } from "react-toastify";
function PasswordReset() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    async function sendResetPassword() {
        setError("");

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        } catch (error) {
            setError("Please enter a valid email address");
        }
    }
    return (
        <div className="flex flex-col text-center items-center justify-center gap-10 h-screen">
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p>Enter your email to receive a password reset link.</p>
            <input
                type="email"
                className="p-2 text-sm text-gray-700 border border-gray-300 rounded w-52"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email address"
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                onClick={sendResetPassword}
            >
                Send Email
            </button>
            <p className="text-red-600">{error}</p>
        </div>
    );
}

export default PasswordReset;
