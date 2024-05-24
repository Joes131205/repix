import Root from "./routes/Root";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Setting from "./routes/Setting";
import Upload from "./routes/Upload";
import Leaderboard from "./routes/Leaderboard";
import ErrorPage from "./routes/ErrorPage";
import Profile from "./routes/Profile";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";
import { db, storage, auth } from "./firebase";

import NavBar from "./components/NavBar";

import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import { ToastContainer } from "react-toastify";

import {
    userDataContext,
    userDataProvider,
} from "./components/UserDataContext";

function App() {
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

    const [data, setData] = useState({
        reputation: 0,
        totalPhotosRated: 0,
        uploaded: 0,
        username: "",
        profilePicture: "",
        loading: true,
    });
    const [totalPhotos, setTotalPhotos] = useState([]);

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
                console.log(user);
                setUid(user.uid);
            } else {
                navigate("/signup");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        handleLogIn();
    }, [uid]);

    return (
        <userDataContext.Provider value={{ data }}>
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
                        element={<SignIn onSigninSuccess={handleLogIn} />}
                    />
                    <Route
                        path="/signup"
                        element={<SignUp onSignupSuccess={handleLogIn} />}
                    />
                    <Route path="/upload" element={<Upload uid={uid} />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route
                        path="/profile"
                        element={
                            <Profile
                                username={data.username}
                                profilePicture={data.profilePicture}
                                reputation={data.reputation}
                                totalPhotosRated={data.totalPhotosRated}
                                photos={totalPhotos}
                                uploaded={data.uploaded}
                            />
                        }
                    />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
                <ToastContainer />
            </div>
        </userDataContext.Provider>
    );
}

export default App;
