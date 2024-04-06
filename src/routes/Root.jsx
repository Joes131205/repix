import { useEffect } from "react";
import app from "../firebase";

import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, getAuth } from "firebase/auth";

function Root() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/signup");
            }
        });
    });
    return <div></div>;
}

export default Root;
