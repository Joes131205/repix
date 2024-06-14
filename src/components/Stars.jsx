function Stars(prop) {
    const stars = new Array(5).fill("★");
    return (
        <div className="flex items-center justify-center text-5xl gap-5">
            {stars.map((star, index) => (
                <button
                    key={index}
                    className={`${
                        prop.rating >= index + 1
                            ? "text-yellow-500"
                            : "text-gray-300 dark:text-gray-100"
                    } hover:scale-110 transition`}
                    onClick={() => prop.setRating(index + 1)}
                >
                    {star}
                </button>
            ))}
        </div>
    );
}

export default Stars;
