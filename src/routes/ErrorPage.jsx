import { useLocation } from "react-router-dom";

function ErrorPage() {
    let location = useLocation();
    console.error(location);
    return (
        <div className="flex flex-col items-center text-center justify-center box-border">
            <h1 className="text-2xl">404</h1>
            <h2>Dang!</h2>
            <p>
                <i>Accessing {location.pathname}</i>
            </p>
        </div>
    );
}

export default ErrorPage;
