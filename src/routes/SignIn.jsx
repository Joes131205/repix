import app from "../firebase";

import { useEffect, useState } from "react";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

function SignIn(prop) {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const auth = getAuth(app);
    auth.useDeviceLanguage();

    const navigate = useNavigate();

    const provider = new GoogleAuthProvider();

    async function signInUserWithGoogle() {
        const signInMethods = await fetchSignInMethodsForEmail(
            auth,
            data.email
        );
        if (signInMethods.length) {
            try {
                await signInWithPopup(auth, provider);
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
        } else {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const uid = user.uid;

            const image = "/images/default_profile_picture.png";
            const response = await fetch(image);
            const blob = await response.blob();
            const newFileName = `${uid}.png`;
            const storageRef = ref(storage, `profile-pictures/${newFileName}`);
            const metadata = { contentType: "image/png" };
            await uploadBytes(storageRef, blob, metadata);

            const username = `user_${uid.slice(1, 5)}`;

            try {
                const db = getFirestore(app);
                const docRef = doc(db, "users", uid);
                await setDoc(docRef, {
                    username,
                    uploaded: 0,
                    reputation: 0,
                    bestRatedPhoto: "",
                    totalPhotosRated: 0,
                });
            } catch (err) {
                console.error("Error adding document: ", err);
            }
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
        <div>
            <form onSubmit={signInUser}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={data.email}
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label htmlFor="password"></label>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                    />
                </div>
            </form>
            <p>{error}</p>
            <button onClick={signInUserWithGoogle}>Sign In With Google</button>
        </div>
    );
}

export default SignIn;
