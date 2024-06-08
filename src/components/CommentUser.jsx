import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";

import { db, storage, auth } from "../firebase";

function CommentUser(prop) {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

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
        fetchData(prop.uid);
    }, []);

    return (
        <div className="flex gap-[4rem] items-center justify-between px-5 h-16 border border-[#D3D3D3] dark:border-[#3d3d3d] bg-[#ececec]  rounded-[4px] dark:bg-gray-700 dark:text-white">
            <div className="flex gap-2 items-center">
                <img src={profilePicture} className="w-10 rounded-full" />
                <h2>{username}</h2>
            </div>
            <p>{prop.comment}</p>
        </div>
    );
}

export default CommentUser;
