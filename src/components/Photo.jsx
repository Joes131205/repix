import { useEffect, useState } from "react";

function Photo(prop) {
    const [url, setUrl] = useState("");

    useEffect(() => {
        console.log(prop.url);
        setUrl(prop.url);
    }, [prop.url]);
    return (
        <div>
            <h1>Photos</h1>
            <img src={url || "/images/placeholder.png"} className="w-52 " />
        </div>
    );
}

export default Photo;
