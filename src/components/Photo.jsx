import { useEffect, useState } from "react";

function Photo(prop) {
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(prop.url);
    }, [prop.url]);
    return (
        <div>
            <img
                src={url || "/images/placeholder.png"}
                className="w-96 h-96 max-w-96 max-h-96 rounded-md border-4 border-black dark:border-gray-500"
            />
        </div>
    );
}

export default Photo;
