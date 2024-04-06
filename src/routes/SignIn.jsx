import app from "../firebase";

import { useEffect, useState } from "react";

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

function SignIn() {
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
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            const errorCode = error.code;
            const words = errorCode.split("/")[1].replaceAll("-", " ");

            const formattedErrorMessage =
                words[0].toUpperCase() + words.slice(1);

            setError(formattedErrorMessage);
        }
    }

    async function signInUser() {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
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
