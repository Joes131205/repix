import { db, storage, auth } from "../firebase";

import { useState } from "react";

import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { toast, Bounce } from "react-toastify";

import { useNavigate, Link } from "react-router-dom";

function SignUp(prop) {
    auth.useDeviceLanguage();

    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    async function storeUsernameAndData(uid, username, profilePhotoUrl) {
        if (!username) {
            username = `user_${uid.slice(1, 5)}`;
        }
        try {
            const docRef = doc(db, "users", uid);
            await setDoc(docRef, {
                username,
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
                profilePhotoUrl,
                uid,
            });
        } catch (err) {
            setError("Failed to create user profile. Please try again.");
        }
    }

    async function storeDefaultProfilePicture(uid) {
        try {
            const image = "/images/default_profile_picture.png";
            const response = await fetch(image);

            if (!response.ok) {
                throw new Error("Failed to fetch default profile picture");
            }

            const blob = await response.blob();

            const newFileName = `${uid}.png`;

            const storageRef = ref(storage, `profile-pictures/${newFileName}`);

            const metadata = { contentType: "image/png" };

            const uploadTask = uploadBytes(storageRef, blob, metadata);
            await uploadTask;

            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            setError(
                "Failed to upload default profile picture. Please try again."
            );
            return null;
        }
    }

    async function signUpUser(e) {
        setError("");

        e.preventDefault();
        const { username, email, password, confirmPassword } = data;
        if (password === confirmPassword) {
            try {
                await createUserWithEmailAndPassword(auth, email, password)
                    .then(async (userCredential) => {
                        const user = userCredential.user;
                        const profilePhotoUrl =
                            await storeDefaultProfilePicture(user.uid);
                        await storeUsernameAndData(
                            user.uid,
                            username,
                            profilePhotoUrl
                        );
                        await sendEmailVerification(user);

                        prop.onSignupSuccess();
                        navigate("/");
                        window.location.reload();
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        switch (errorCode) {
                            case "auth/email-already-in-use":
                                setError(
                                    "Email already in use. Please try a different email."
                                );
                                break;
                            case "auth/invalid-email":
                                setError(
                                    "Invalid email address. Please try again."
                                );
                                break;
                            case "auth/weak-password":
                                setError(
                                    "Password is too weak. Please try a stronger password."
                                );
                                break;
                            default:
                                setError(
                                    "Failed to sign up. Please try again."
                                );
                        }
                    });
            } catch (error) {
                setError("Failed to sign up. Please try again.");
            }
        } else {
            setError("Passwords do not match. Please try again.");
        }
    }

    async function signUpUserWithGoogle() {
        setError("");

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, "users", user.uid);
            const existingData = await getDoc(docRef);
            const existingUsername = existingData.data()?.username;
            const existingProfilePhotoUrl =
                existingData.data()?.profilePhotoUrl;

            const profilePhotoUrl = await storeDefaultProfilePicture(user.uid);
            await storeUsernameAndData(
                user.uid,
                existingUsername || "",
                profilePhotoUrl || existingProfilePhotoUrl
            );
            toast.success("Signed Up! Email verification sent!", {
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
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.log(error);
            const errorCode = error.code;
            switch (errorCode) {
                case "auth/account-exists-with-different-credential":
                    setError(
                        "Account exists with different credential. Please try again."
                    );
                    break;
                case "auth/auth-domain-config-required":
                    setError(
                        "Authentication domain config is required. Please try again."
                    );
                    break;
                case "auth/cancelled-popup-request":
                    setError("Popup request was cancelled. Please try again.");
                    break;
                case "auth/operation-not-allowed":
                    setError("Operation is not allowed. Please try again.");
                    break;
                case "auth/popup-blocked":
                    setError("Popup was blocked. Please try again.");
                    break;
                case "auth/popup-closed-by-user":
                    setError("Popup was closed by user. Please try again.");
                    break;
                case "auth/unauthorized-domain":
                    setError("Unauthorized domain. Please try again.");
                    break;
                default:
                    setError(
                        "Failed to sign up with Google. Please try again."
                    );
            }
        }
    }

    return (
        <div className="flex flex-col h-screen items-center justify-center gap-5">
            <h1 className="font-bold text-2xl">Sign Up</h1>
            <form onSubmit={signUpUser} className="flex flex-col gap-10">
                <div className="flex gap-5 items-center justify-center">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        className="text-black bg-gray-50 border border-gray-500 rounded px-4 py-2"
                        placeholder="Username..."
                        value={data.username}
                        onChange={(e) =>
                            setData({ ...data, username: e.target.value })
                        }
                    />
                </div>
                <div className="flex gap-5 items-center justify-center">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        className="text-black bg-gray-50 border border-gray-500 rounded px-4 py-2"
                        placeholder="Email..."
                        value={data.email}
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
                        placeholder="Password..."
                        value={data.password}
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                    />
                </div>
                <div className="flex gap-5 items-center justify-center">
                    <label htmlFor="confirmPassword">
                        Confirm your password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className="text-black bg-gray-50 border border-gray-500 rounded px-4 py-2"
                        placeholder="Confirm your password..."
                        value={data.confirmPassword}
                        onChange={(e) =>
                            setData({
                                ...data,
                                confirmPassword: e.target.value,
                            })
                        }
                    />
                </div>
                <input
                    type="submit"
                    value="Sign Up!"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                />
            </form>
            <p className="text-red-600">{error}</p>
            <button
                onClick={signUpUserWithGoogle}
                className="flex gap-5 items-center justify-center bg-white text-black px-5 py-2 font-bold rounded-md hover:bg-gray-200 transition border-2 border-black"
            >
                {" "}
                <img
                    src="/images/google-color-svgrepo-com.svg"
                    alt="Google Icon"
                    className="w-5 h-5"
                />{" "}
                Sign Up With Google
                <img
                    src="/images/google-color-svgrepo-com.svg"
                    alt="Google Icon"
                    className="w-5 h-5"
                />{" "}
            </button>
            <Link to="/signin" className="underline text-blue-400">
                Already have an account?
            </Link>
        </div>
    );
}

export default SignUp;
