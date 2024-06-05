import { db, storage, auth } from "../firebase";

import { useEffect, useState } from "react";

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import { setDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

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
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const uid = user.uid;

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.exists());
            if (docSnap.exists()) {
                console.log("User already exists, logging in...");
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
                prop.onSignupSuccess();
            } else {
                console.log("User doesn't exist, creating new user...");
                await setDoc(docRef, {
                    username: `user_${uid.slice(1, 5)}`,
                    uploaded: 0,
                    reputation: 0,
                    bestRatedPhoto: "",
                    totalPhotosRated: 0,
                    ratedPhotos: [],
                    totalPhotosDaily: {
                        rated: 0,
                        uploaded: 0,
                        timeLastRated: "",
                        timeLastUploaded: "",
                    },
                });
                const image = "/images/default_profile_picture.png";
                const response = await fetch(image);

                if (response.ok) {
                    const blob = await response.blob();
                    const newFileName = `${uid}.png`;
                    const storageRef = ref(
                        storage,
                        `profile-pictures/${newFileName}`
                    );
                    const metadata = { contentType: "image/png" };
                    await uploadBytes(storageRef, blob, metadata);
                } else {
                    console.error(
                        "Failed to fetch default profile picture:",
                        response.statusText
                    );
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function signInUser() {
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
            prop.onSignupSuccess();
        } catch (error) {
            const errorCode = error.code;
            const words = errorCode.split("/")[1].replaceAll("-", " ");

            const formattedErrorMessage =
                words[0].toUpperCase() + words.slice(1);

            setError(formattedErrorMessage);
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
    });

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
                    />
                </div>
                <input
                    type="submit"
                    value="Sign In!"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                />
            </form>
            <p>{error}</p>
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
            <Link to="/signup" className="underline text-blue-400">
                Don't have an account?
            </Link>
        </div>
    );
}

export default SignIn;
