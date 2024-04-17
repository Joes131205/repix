import { useState } from "react";

function Stars() {
    const [rating, setRating] = useState(0);
    const stars = new Array(5).fill("★");
    return (
        <div className="flex items-center justify-center text-5xl">
            {stars.map((star, index) => (
                <button
                    key={index}
                    className={
                        rating >= index + 1
                            ? "text-yellow-500"
                            : "text-gray-300"
                    }
                    onClick={() => setRating(index + 1)}
                >
                    {star}
                </button>
            ))}
        </div>
    );
}

export default Stars;
