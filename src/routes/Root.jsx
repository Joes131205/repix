import { useEffect, useState } from "react";
import app from "../firebase";

import NavBar from "../components/NavBar";

import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

function Root() {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [uid, setUid] = useState("");

    const auth = getAuth(app);
    const navigate = useNavigate();
    const db = getFirestore(app);
    const storage = getStorage(app);
    async function fetchUserName(uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setUsername(data.username);
    }

    async function fetchProfilePicture(uid) {
        const storageRef = ref(storage, `profile-pictures/${uid}.png`);
        const url = await getDownloadURL(storageRef);
        setProfilePicture(url);
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                await fetchUserName(uid);
                await fetchProfilePicture(uid);
            } else {
                navigate("/signup");
            }
        });
    });

    return (
        <div>
            <NavBar username={username} profilePicture={profilePicture} />
        </div>
    );
}

export default Root;
