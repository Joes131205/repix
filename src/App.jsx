import React, { useEffect, useState, useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { db, storage, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { ToastContainer } from "react-toastify";

import Root from "./routes/Root";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Setting from "./routes/Setting";
import Upload from "./routes/Upload";
import Leaderboard from "./routes/Leaderboard";
import ErrorPage from "./routes/ErrorPage";
import Profile from "./routes/Profile";

import NavBar from "./components/NavBar";
import {
    UserDataContext,
    UserDataProvider,
} from "./components/UserDataContext";

function App() {
    console.log(useContext(UserDataContext));
    const routeTitles = {
        "/": "Home",
        "/signin": "Sign In",
        "/signup": "Sign Up",
        "/upload": "Upload Photo",
        "/leaderboard": "Leaderboard",
        "/profile": "Profile",
        "/setting": "Setting",
    };

    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        const title = "Repix | " + (routeTitles[pathname] || "Error");
        document.title = title;
    }, [location]);

    const [uid, setUid] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    async function getAllPhotos(uid) {
        const photosCollection = collection(db, "photos");
        const querySnapshot = await getDocs(photosCollection);
        if (querySnapshot.length === 0) return;
        const photoData = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.uid === uid) {
                photoData.push(data);
            }
        });

        if (photoData) {
            setTotalPhotos(photoData);
        }
    }

    async function fetchData(uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        const userData = docSnap.data();

        const storageRef = ref(storage, `profile-pictures/${uid}.png`);
        const url = await getDownloadURL(storageRef);
        userData.profilePicture = url;

        setData({ ...userData, loading: false });
    }

    const handleLogIn = () => {
        setIsLoggedIn(true);
        fetchData(uid);
        getAllPhotos(uid);
    };

    const handleSignout = () => {
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                navigate("/signup");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (uid) {
            handleLogIn();
        }
    }, [uid]);

    const routes = (
        <Routes>
            <Route path="/" element={<Root />} />
            <Route
                path="/signin"
                element={<SignIn onSigninSuccess={handleLogIn} />}
            />
            <Route
                path="/signup"
                element={<SignUp onSignupSuccess={handleLogIn} />}
            />
            <Route path="/upload" element={<Upload />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );

    console.log("Children passed to userDataProvider:", routes);

    return (
        <UserDataProvider>
            <NavBar isLoggedIn={isLoggedIn} onSignoutSuccess={handleSignout} />
            {routes}
            <ToastContainer />
        </UserDataProvider>
    );
}

export default App;
