import { db, storage, auth } from "../firebase";

import { useState } from "react";

import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import { setDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

function SignIn(prop) {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    auth.useDeviceLanguage();

    const navigate = useNavigate();

    const provider = new GoogleAuthProvider();

    async function signInUserWithGoogle() {
        setError("");

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const uid = user.uid;

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                toast.success("Signed In!", {
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
                prop.onSigninSuccess();
            } else {
                const image = "/images/default_profile_picture.png";
                const response = await fetch(image);

                if (response.ok) {
                    const blob = await response.blob();
                    const newFileName = `${uid}.png`;
                    const storageRef = ref(
                        storage,
                        `profile-pictures/${newFileName}`
                    );
                    const metadata = {
                        contentType: "image/png",
                    };
                    const uploadTask = uploadBytes(storageRef, blob, metadata);
                    await uploadTask;

                    const downloadURL = await getDownloadURL(storageRef);

                    await setDoc(docRef, {
                        username: `user_${uid.slice(1, 5)}`,
                        uploaded: 0,
                        reputation: 0,
                        totalPhotosRated: 0,
                        totalPhotosDaily: {
                            lastRated: 0,
                            lastUploaded: 0,
                            timeLastRated: "",
                            timeLastUploaded: "",
                        },
                        ratedPhotos: [],
                        profilePhotoUrl: downloadURL,
                        uid,
                    });
                    prop.onSigninSuccess();
                    window.location.reload();

                    navigate("/");
                } else {
                    throw new Error(
                        "Failed to fetch default profile picture:",
                        response.statusText
                    );
                }
            }
        } catch (error) {
            console.log(error);
            setError("Error signing in with Google. Please try again.");
        }
    }

    async function signInUser(e) {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            toast.success("Signed In!", {
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

            prop.onSigninSuccess();
            navigate("/");
        } catch (error) {
            const errorCode = error.code;
            let errorMessage = "";

            switch (errorCode) {
                case "auth/invalid-email":
                    errorMessage = "Invalid email address. Please try again.";
                    break;
                case "auth/user-not-found":
                    errorMessage =
                        "User not found. Please sign up or try again.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                default:
                    errorMessage = "An error occurred. Please try again.";
            }

            setError(errorMessage);
        }
    }

    return (
        <div className="flex flex-col h-screen items-center justify-center gap-10">
            <h1 className="font-bold text-2xl">Sign In</h1>
            <form onSubmit={signInUser} className="flex flex-col gap-20">
                <div className="flex gap-5 items-center justify-center">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={data.email}
                        className="text-black bg-gray-50 border border-gray-500 rounded px-4 py-2"
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                    />
                </div>
                <div className="flex gap-5 items-center justify-center">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="text-black bg-gray-50 border border-gray-500 rounded px-4 py-2"
                        value={data.password}
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                    />
                </div>
                <input
                    type="submit"
                    value="Sign In!"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                />
            </form>
            <Link
                className="underline text-blue-400 cursor-pointer"
                to="/resetpassword"
            >
                Forget password?
            </Link>
            <button
                onClick={signInUserWithGoogle}
                className="flex gap-5 items-center justify-center bg-white text-black px-5 py-2 font-bold rounded-md hover:bg-gray-200 transition border-2 border-black"
            >
                {" "}
                <img
                    src="/images/google-color-svgrepo-com.svg"
                    alt="Google Icon"
                    className="w-5 h-5"
                />{" "}
                Sign In With Google{" "}
                <img
                    src="/images/google-color-svgrepo-com.svg"
                    alt="Google Icon"
                    className="w-5 h-5"
                />{" "}
            </button>
            <p className="text-red-600">{error}</p>

            <Link to="/signup" className="underline text-blue-400">
                Don't have an account?
            </Link>
        </div>
    );
}

export default SignIn;
