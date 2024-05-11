import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../firebase";
import { useState, useEffect } from "react";

function NavBar({ isLoggedIn, username, profilePicture, onSignoutSuccess }) {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigate("/signin");
                onSignoutSuccess();
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [darkMode]);
    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }
    return (
        <div
            className={`flex items-center justify-between sticky bg-slate-300 h-12 px-5 mb-2 dark:bg-gray-900`}
        >
            {isLoggedIn ? (
                <div className="flex gap-12 items-center justify-around">
                    <div>
                        <Link to="/profile" className="flex gap-5 items-center">
                            <img
                                src={
                                    profilePicture || "/images/placeholder.png"
                                }
                                alt="Profile Picture"
                                className="w-10 h-10 rounded-full"
                            />
                            <h1 className="font-bold">{username}</h1>
                        </Link>
                    </div>
                    <Link to="/">Home</Link>
                    <Link to="/upload">Upload</Link>
                    <Link to="/leaderboard">Leaderboard</Link>
                    <Link to="/setting">Setting</Link>
                    <button onClick={handleSignOut}>Sign Out</button>
                    <button onClick={toggleDarkMode}>
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            ) : (
                <h1 className="font-bold">Repix</h1>
            )}
        </div>
    );
}

export default NavBar;
