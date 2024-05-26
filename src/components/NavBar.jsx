import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../firebase";
import { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../components/UserDataContext";

function NavBar({ isLoggedIn, onSignoutSuccess }) {
    console.log(UserDataContext);
    console.log(useContext(UserDataContext));
    const { userData } = useContext(UserDataContext);
    console.log(userData);
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

    useEffect(() => {
        const isDarkMode = JSON.parse(localStorage.getItem("isDarkMode"));
        setDarkMode(isDarkMode);
    }, []);

    function toggleDarkMode() {
        localStorage.setItem("isDarkMode", JSON.stringify(!darkMode));
        setDarkMode(!darkMode);
    }

    return (
        <div
            className={`flex items-center justify-between sticky bg-gray-200 h-12 px-5 mb-2 dark:bg-[#333333]`}
        >
            {isLoggedIn ? (
                <div className="flex gap-12 items-center justify-around">
                    <div>
                        <Link
                            to="/profile"
                            className="flex gap-5 items-center dark:text-white text-black hover:underline decoration-2 dark:decoration-white decoration-black"
                        >
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
                    <Link
                        to="/"
                        className="dark:text-white text-black hover:underline decoration-2 dark:decoration-white decoration-black"
                    >
                        Home
                    </Link>
                    <Link
                        to="/upload"
                        className="dark:text-white text-black hover:underline decoration-2 dark:decoration-white decoration-black"
                    >
                        Upload
                    </Link>
                    <Link
                        to="/leaderboard"
                        className="dark:text-white text-black hover:underline decoration-2 dark:decoration-white decoration-black"
                    >
                        Leaderboard
                    </Link>
                    <Link
                        to="/setting"
                        className="dark:text-white text-black hover:underline decoration-2 dark:decoration-white decoration-black"
                    >
                        Setting
                    </Link>
                    <button
                        onDoubleClick={handleSignOut}
                        className="dark:text-white text-black hover:underline decoration-2 dark:decoration-white decoration-black"
                    >
                        Sign Out
                    </button>
                    <button
                        onClick={toggleDarkMode}
                        className="dark:text-white text-black hover:underline decoration-2 flex items-center justify-center gap-5 dark:decoration-white decoration-black"
                    >
                        <img
                            src={
                                darkMode
                                    ? "/images/light_mode.svg"
                                    : "/images/dark_mode.svg"
                            }
                            className="w-8 h-8"
                        />
                        <p>{darkMode ? "Light Mode" : "Dark Mode"}</p>
                        <img
                            src={
                                darkMode
                                    ? "/images/light_mode.svg"
                                    : "/images/dark_mode.svg"
                            }
                            className="w-8 h-8"
                        />
                    </button>
                </div>
            ) : (
                <div className="flex gap-10 items-center justify-around">
                    <h1 className="font-bold">Repix</h1>
                    <button
                        onClick={toggleDarkMode}
                        className="dark:text-white text-black hover:underline decoration-2 flex items-center justify-center gap-5 dark:decoration-white decoration-black"
                    >
                        <img
                            src={
                                darkMode
                                    ? "/images/light_mode.svg"
                                    : "/images/dark_mode.svg"
                            }
                            className="w-8 h-8"
                        />
                        <p>{darkMode ? "Light Mode" : "Dark Mode"}</p>
                        <img
                            src={
                                darkMode
                                    ? "/images/light_mode.svg"
                                    : "/images/dark_mode.svg"
                            }
                            className="w-8 h-8"
                        />
                    </button>
                </div>
            )}
        </div>
    );
}

export default NavBar;
