import { Routes, Route } from "react-router-dom";

import Root from "./routes/Root";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<Root />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;
