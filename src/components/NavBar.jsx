import { Link } from "react-router-dom";

import app from "../firebase";

import { getAuth, signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

function NavBar(prop) {
    const auth = getAuth(app);
    const navigate = useNavigate();

    return (
        <>
            {prop.isLoggedIn ? (
                <div className="flex items-center justify-around sticky bg-slate-400 h-10 px-5 mb-2">
                    <div className="flex gap-12 items-center justify-around">
                        <div>
                            <Link
                                to="/profile"
                                className="flex gap-5 items-center"
                            >
                                <img
                                    src={
                                        prop.profilePicture ||
                                        "/images/placeholder.png"
                                    }
                                    alt="Profile Picture"
                                    className="w-10 h-10 rounded-full"
                                />
                                <h1>{prop.username}</h1>
                            </Link>
                        </div>
                        <Link to="/">Home</Link>
                        <Link to="/upload">Upload</Link>
                        <Link to="/leaderboard">Leaderboard</Link>
                        <Link to="/setting">Setting</Link>
                    </div>
                    <div>
                        <button
                            onClick={() =>
                                signOut(auth).then(() => {
                                    navigate("/signin");
                                    prop.onSignoutSuccess();
                                })
                            }
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-12 items-center sticky bg-slate-400 h-10 px-5 mb-2">
                    <h1 className="font-bold">Repix</h1>
                </div>
            )}
        </>
    );
}

export default NavBar;
