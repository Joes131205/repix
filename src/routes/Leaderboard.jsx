import {
    getDocs,
    getFirestore,
    query,
    orderBy,
    collection,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import app from "../firebase";
import { useEffect, useState } from "react";

import User from "../components/User";

function Leaderboard() {
    const db = getFirestore(app);
    const [users, setUsers] = useState([]);

    const storage = getStorage(app);

    async function getUsers() {
        const docRef = collection(db, "users");
        const q = query(docRef, orderBy("reputation", "desc"));
        const querySnapshot = await getDocs(q);
        const docData = querySnapshot.docs.map((doc) => doc.data());
        docData.map((user) => {
            const storageRef = ref(storage, `profile-pictures/${uid}.png`);
            const url = getDownloadURL(storageRef);
            user.profilePicture = url;
        });
        setUsers(docData);
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
            <h1>Leaderboard</h1>
            <div>
                {users.map((user, i) => {
                    return (
                        <User
                            rank={i + 1}
                            reputation={user.reputation}
                            username={user.username}
                            profilePicture={user.profilePicture}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Leaderboard;
