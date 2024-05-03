import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";

import app from "../firebase";

function CommentUser(prop) {
    console.log(prop);
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const db = getFirestore(app);
    const storage = getStorage(app);

    async function fetchUsername(uid) {
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
    async function fetchData(uid) {
        fetchUsername(uid);
        fetchProfilePicture(uid);
    }

    useEffect(() => {
        console.log(prop.uid);
        fetchData(prop.uid);
    }, []);
    return (
        <div className="flex gap-[4rem] items-center justify-center h-12">
            <div className="flex gap-2 items-center">
                <img src={profilePicture} className="w-10" />
                <h2>{username}</h2>
            </div>
            <p>{prop.comment}</p>
        </div>
    );
}

export default CommentUser;
