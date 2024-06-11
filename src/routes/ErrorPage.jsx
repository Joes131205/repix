import { useLocation, Link } from "react-router-dom";

function ErrorPage() {
    let location = useLocation();
    return (
        <div className="flex flex-col items-center text-center justify-center box-border gap-10 h-screen">
            <h1 className="text-2xl font-bold">404</h1>
            <h2>Dang!</h2>
            <p>
                <i>Accessing {location.pathname}</i>
            </p>
            <Link
                to="/"
                className="bg-red-700 px-4 py-2 rounded-lg font-bold hover:bg-red-900 transition"
            >
                Go back
            </Link>
        </div>
    );
}

export default ErrorPage;
