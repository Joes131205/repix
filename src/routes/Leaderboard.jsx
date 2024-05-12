import { getDocs, query, orderBy, collection } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import { db, storage, auth } from "../firebase";
import { useEffect, useState } from "react";

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
        <div className="flex flex-col items-center justify-center gap-12">
            <h1 className="font-bold">Leaderboard</h1>
            <table class="w-full table-auto">
                <thead>
                    <tr>
                        <th class="px-4 py-2 text-center">Rank</th>
                        <th class="px-4 py-2 text-center">User</th>
                        <th class="px-4 py-2 text-center">Total Reputation</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    {users.map((user, i) => {
                        return (
                            <tr key={i}>
                                <td class="px-4 py-2 text-center">{i + 1}</td>
                                <td class="px-4 py-2 flex items-center justify-center gap-4">
                                    <img
                                        src={user.profilePicture}
                                        class="w-10 h-10 rounded-full"
                                    />
                                    <p class=" font-medium">{user.username}</p>
                                </td>
                                <td class="px-4 py-2 text-center">
                                    {user.reputation}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Leaderboard;
