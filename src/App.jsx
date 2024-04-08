import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/Root";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Setting from "./routes/Setting";
import Upload from "./routes/Upload";
import Leaderboard from "./routes/Leaderboard";
import ErrorPage from "./routes/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/signin",
        element: <SignIn />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/setting",
        element: <Setting />,
    },
    {
        path: "/upload",
        element: <Upload />,
    },
    {
        path: "/leaderboard",
        element: <Leaderboard />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
]);
function App() {
    return <RouterProvider router={router} />;
}

export default App;
