import { Link } from "react-router-dom";

import app from "../firebase";

import { getAuth, signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

function NavBar(prop) {
    const auth = getAuth(app);
    const navigate = useNavigate();

    return (
        <>
            {prop.isLoggedIn && (
                <div className="flex gap-12 items-center sticky">
                    <div>
                        <Link to="/profile" className="flex gap-5 items-center">
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
            )}
        </>
    );
}

export default NavBar;
