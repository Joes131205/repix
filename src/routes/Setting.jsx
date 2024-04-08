import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import app from "../firebase";

import { getAuth } from "firebase/auth";
function Setting() {
    const [data, setData] = useState({
        username: "",
        profilePicture: "",
    });

    const auth = getAuth(app);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log(user);
        });
    }, []);
    return (
        <div>
            <h1>Setting</h1>
            <div className="w-screen flex items-center gap-5">
                <img
                    src={data.profilePicture}
                    alt="Profile Picture"
                    className="w-10 h-10 rounded-full"
                />
                <h1>{data.username}</h1>
            </div>
            <div className="w-screen flex items-center gap-5">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    placeholder="Username..."
                    value={data.username}
                />
            </div>

            <div>
                <label htmlFor="profilePicture">Profile Picture</label>
                <input type="file" name="profilePicture" />
            </div>
        </div>
    );
}

export default Setting;
