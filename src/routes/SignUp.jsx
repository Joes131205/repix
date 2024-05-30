import { db, storage, auth } from "../firebase";

import { useEffect, useState } from "react";

import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
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
                bestRatedPhoto: "",
                totalPhotosRated: 0,
                totalPhotosDaily: {
                    rated: 0,
                    uploaded: 0,
                    timeLastRated: "",
                    timeLastUploaded: "",
                },
                profilePhotoUrl,
                uid,
            });
            console.log("user created");
        } catch (err) {
            console.error("Error adding document: ", err);
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
            console.error("Error storing default profile picture:", error);
            return null;
        }
    }

    async function signUpUser(e) {
        e.preventDefault();
        const { username, email, password, confirmPassword } = data;
        if (password === confirmPassword) {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    const profilePhotoUrl = await storeDefaultProfilePicture(
                        user.uid
                    );
                    await storeUsernameAndData(
                        user.uid,
                        username,
                        profilePhotoUrl
                    );
                    await sendEmailVerification();
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
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const words = errorCode.split("/")[1].replaceAll("-", " ");

                    const formattedErrorMessage =
                        words[0].toUpperCase() + words.slice(1);

                    setError(formattedErrorMessage);
                });
        }
    }
    async function signUpUserWithGoogle() {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const profilePhotoUrl = await storeDefaultProfilePicture(user.uid);
            await storeUsernameAndData(user.uid, uid, profilePhotoUrl);
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
        <div className="flex flex-col h-screen items-center justify-center gap-5">
            <h1 className="font-bold text-2xl">Sign Up</h1>
            <form onSubmit={signUpUser} className="flex flex-col gap-10">
                <div className="flex gap-5 items-center justify-center">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        className="text-white bg-gray-50 border border-gray-500 rounded px-4 py-2"
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
                        className="text-white bg-gray-50 border border-gray-500 rounded px-4 py-2"
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
                        className="text-white bg-gray-50 border border-gray-500 rounded px-4 py-2"
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
                        className="text-white bg-gray-50 border border-gray-500 rounded px-4 py-2"
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
            <p>{error}</p>
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
