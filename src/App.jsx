import React, { useEffect, useState, useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Root from "./routes/Root";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Setting from "./routes/Setting";
import Upload from "./routes/Upload";
import Leaderboard from "./routes/Leaderboard";
import ErrorPage from "./routes/ErrorPage";
import Profile from "./routes/Profile";

import NavBar from "./components/NavBar";
import {
    UserDataContext,
    UserDataProvider,
} from "./components/UserDataContext";

function App() {
    const { userData } = useContext(UserDataContext);

    const routeTitles = {
        "/": "Home",
        "/signin": "Sign In",
        "/signup": "Sign Up",
        "/upload": "Upload Photo",
        "/leaderboard": "Leaderboard",
        "/profile": "Profile",
        "/setting": "Setting",
    };

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const pathname = location.pathname;
        const title = "Repix | " + (routeTitles[pathname] || "Error");
        document.title = title;
    }, [location]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogIn = () => {
        setIsLoggedIn(true);
    };

    const handleSignout = () => {
        setIsLoggedIn(false);
    };

    useEffect(() => {
        if (userData.uid) {
            handleLogIn();
        } else {
            navigate("/signup");
        }
    }, [userData.uid]);

    const routes = (
        <Routes>
            <Route path="/" element={<Root />} />
            <Route
                path="/signin"
                element={<SignIn onSigninSuccess={handleLogIn} />}
            />
            <Route
                path="/signup"
                element={<SignUp onSignupSuccess={handleLogIn} />}
            />
            <Route path="/upload" element={<Upload />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );

    return (
        <UserDataProvider>
            <NavBar isLoggedIn={isLoggedIn} onSignoutSuccess={handleSignout} />
            {routes}
            <ToastContainer />
        </UserDataProvider>
    );
}

export default App;
