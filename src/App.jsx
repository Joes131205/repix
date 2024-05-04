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
import { db, storage, auth } from "./firebase";

import NavBar from "./components/NavBar";

import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { ToastContainer } from "react-toastify";

function App() {
    const [data, setData] = useState({
        reputation: 0,
        totalPhotosRated: 0,
        uploaded: 0,
        username: "",
        profilePicture: "",
    });
    const [totalPhotos, setTotalPhotos] = useState([]);

    const [uid, setUid] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogIn = () => {
        setIsLoggedIn(true);
        fetchData(uid);
        getAllPhotos(uid);
    };
    const handleSignout = () => {
        setIsLoggedIn(false);
    };
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
        console.log(uid);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("No such document!");
            return;
        }

        const userData = docSnap.data();

        const storageRef = ref(storage, `profile-pictures/${uid}.png`);
        const url = await getDownloadURL(storageRef);
        userData.profilePicture = url;

        setData({ ...userData });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                handleLogIn();
            } else {
                navigate("/signup");
            }
            return unsubscribe;
        });

        return () => unsubscribe();
    }, []);

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
    );
}

export default App;
