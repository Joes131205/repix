import {
    getDocs,
    doc,
    getFirestore,
    query,
    orderBy,
    collection,
} from "firebase/firestore";

import app from "../firebase";
import { useEffect, useState } from "react";

import User from "../components/User";

function Leaderboard() {
    const db = getFirestore(app);
    const [users, setUsers] = useState([]);

    async function getUsers() {
        const docRef = collection(db, "users");
        const q = query(docRef, orderBy("reputation", "desc"));
        const querySnapshot = await getDocs(q);
        const docData = querySnapshot.docs.map((doc) => doc.data());
        setUsers(docData);
    }

    useEffect(() => {
        getUsers();
    }, []);
    return (
        <div>
            <h1>Leaderboard</h1>
            <div>
                {users.map((user) => {
                    return (
                        <User
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
