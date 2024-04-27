import { useEffect, useState } from "react";

function Photo(prop) {
    const [url, setUrl] = useState("");

    useEffect(() => {
        console.log(prop.url);
        setUrl(prop.url);
    }, [prop.url]);
    return (
        <div>
            <img src={url || "/images/placeholder.png"} className="w-96" />
        </div>
    );
}

export default Photo;
