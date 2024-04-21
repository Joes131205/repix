import { useEffect, useState } from "react";

function Photo(prop) {
    const [url, setUrl] = useState("");
    useEffect(() => {
        setUrl(prop.url);
    }, [prop.url]);
    return (
        <div>
            <h1>Photos</h1>
            <img src={url || "/images/placeholder.png"} />
        </div>
    );
}

export default Photo;
