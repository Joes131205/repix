import app from "../firebase";

import { useEffect, useState } from "react";

import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import { useNavigate, Link } from "react-router-dom";

function SignUp() {
    const auth = getAuth(app);
    auth.useDeviceLanguage();

    const storage = getStorage(app);

    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    async function storeUsername(uid, username) {
        if (!username) {
            username = `user_${uid.slice(1, 5)}`;
        }
        try {
            const db = getFirestore(app);
            const docRef = doc(db, "users", uid);
            await setDoc(docRef, { username });
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    }

    async function storeDefaultProfilePicture(uid) {
        const image = "/images/default_profile_picture.png";
        const response = await fetch(image);
        const blob = await response.blob();
        const newFileName = `${uid}.png`;
        const storageRef = ref(storage, `profile-pictures/${newFileName}`);
        const metadata = { contentType: "image/png" };
        await uploadBytes(storageRef, blob, metadata);
    }

    async function signUpUser(e) {
        e.preventDefault();
        if (password === confirmPassword) {
            const { username, email, password } = data;
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    await storeUsername(user.uid, username);
                    await storeDefaultProfilePicture(user.uid);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        }
    }

    async function signUpUserWithGoogle() {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await storeUsername(user.uid, username);
            await storeDefaultProfilePicture(user.uid);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
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
            <h1>Sign Up</h1>
            <form onSubmit={signUpUser}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username..."
                        value={data.username}
                        onChange={(e) =>
                            setData({ ...data, username: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email..."
                        value={data.email}
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password..."
                        value={data.password}
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">
                        Confirm your password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
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
                <input type="submit" value="Submit" />
            </form>
            <button onClick={signUpUserWithGoogle}>Sign Up With Google</button>
            <Link to="/signin">Already have an account?</Link>
        </div>
    );
}

export default SignUp;
