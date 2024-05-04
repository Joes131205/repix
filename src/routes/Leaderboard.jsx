import { getDocs, query, orderBy, collection } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import { db, storage, auth } from "../firebase";
import { useEffect, useState } from "react";

import User from "../components/User";

function Leaderboard() {
    const [users, setUsers] = useState([]);

    async function getUsers() {
        const docRef = collection(db, "users");
        const q = query(docRef, orderBy("reputation", "desc"));
        const querySnapshot = await getDocs(q);
        const docData = querySnapshot.docs.map(async (doc) => {
            const user = doc.data();
            const storageRef = ref(storage, `profile-pictures/${doc.id}.png`);
            const url = await getDownloadURL(storageRef);
            user.profilePicture = url;
            return user;
        });
        const allUsers = await Promise.all(docData);
        setUsers(allUsers);
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
            <h1>Leaderboard</h1>
            <div className="flex flex-col gap-10">
                {users.map((user, i) => {
                    return (
                        <User
                            key={i}
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
