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

import { ToastContainer } from "react-toastify";

function App() {
    const [data, setData] = useState({
        bestRatedPhoto: "",
        reputation: 0,
        totalPhotosRated: 0,
        uploaded: 0,
        username: "",
        profilePicture: "",
    });
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
                await fetchData(user.uid);
                setIsLoggedIn(true);
                console.log(data);
            } else {
                navigate("/signup");
            }
            return unsubscribe;
        });

        return () => unsubscribe();
    }, []);

    async function fetchData(uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();

        const storageRef = ref(storage, `profile-pictures/${uid}.png`);
        const url = await getDownloadURL(storageRef);
        userData.profilePicture = url;

        setData({ ...userData });
    }

    return (
        <div>
            <NavBar
                username={data.username}
                profilePicture={data.profilePicture}
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
                            username={data.username}
                            profilePicture={data.profilePicture}
                            reputation={data.reputation}
                            totalPhotosRated={data.totalPhotosRated}
                            bestRatedPhoto={data.bestRatedPhoto}
                            uploaded={data.uploaded}
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
