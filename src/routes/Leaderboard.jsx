import { getDocs, query, orderBy, collection } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import { db, storage } from "../firebase";
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
            <h1 className="font-bold text-2xl">Leaderboard</h1>

            <table className="w-[40%] table-auto">
                <thead>
                    <tr className="px-4 py-2 text-center">
                        <th>Rank</th>
                        <th>User</th>
                        <th>Total Reputation</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user, i) => {
                        return (
                            <tr
                                key={i}
                                className={`${
                                    i === 0
                                        ? "dark:bg-yellow-800 bg-yellow-300"
                                        : i === 1
                                        ? "dark:bg-slate-600 bg-slate-400"
                                        : i === 2
                                        ? "dark:bg-orange-800 bg-yellow-600"
                                        : ""
                                } `}
                            >
                                <td className="px-4 py-2 text-center">
                                    {i + 1}
                                </td>
                                <td className="px-4 py-2 flex items-center justify-center gap-4 ">
                                    <img
                                        src={user.profilePicture}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <p className=" font-medium">
                                        {user.username}
                                    </p>
                                </td>
                                <td className="px-4 py-2 text-center">
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
