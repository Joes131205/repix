import Root from "./routes/Root";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Setting from "./routes/Setting";
import Upload from "./routes/Upload";
import Leaderboard from "./routes/Leaderboard";
import ErrorPage from "./routes/ErrorPage";
import Profile from "./routes/Profile";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import app from "./firebase";

import NavBar from "./components/NavBar";

import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { ToastContainer, toast } from "react-toastify";

function App() {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [uid, setUid] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSignupSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleSignout = () => {
        setIsLoggedIn(false);
    };

    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                await fetchUserName(user.uid);
                await fetchProfilePicture(user.uid);
                setIsLoggedIn(true);
            } else {
                navigate("/signup");
            }
            return unsubscribe;
        });

        return () => unsubscribe();
    }, []);

    async function fetchUserName(uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (data) {
            setUsername(data.username);
        } else {
            console.warn("Username not found for:", uid);
        }
    }

    async function fetchProfilePicture(uid) {
        const storageRef = ref(storage, `profile-pictures/${uid}.png`);
        try {
            const url = await getDownloadURL(storageRef);
            setProfilePicture(url);
        } catch (error) {
            console.warn("Error fetching profile picture:", error);
        }
    }

    return (
        <div>
            <NavBar
                username={username}
                profilePicture={profilePicture}
                isLoggedIn={isLoggedIn}
                onSignoutSuccess={handleSignout}
            />
            <Routes>
                <Route path="/" element={<Root />} />
                <Route
                    path="/signin"
                    element={<SignIn onSigninSuccess={handleSignupSuccess} />}
                />
                <Route
                    path="/signup"
                    element={<SignUp onSignupSuccess={handleSignupSuccess} />}
                />
                <Route path="/upload" element={<Upload />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route
                    path="/profile"
                    element={
                        <Profile
                            username={username}
                            profilePicture={profilePicture}
                            uid={uid}
                        />
                    }
                />
                <Route path="/setting" element={<Setting />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
            <ToastContainer />
        </div>
    );
}

export default App;
