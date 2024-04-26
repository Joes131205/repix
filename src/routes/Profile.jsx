function Profile(prop) {
    console.log(prop.bestRatedPhoto);
    return (
        <div>
            <h1>Profile</h1>
            <div>
                <img
                    src={prop.profilePicture || "/images/placeholder.png"}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full"
                />
                <h2>{prop.username}</h2>
            </div>
            <div>
                <p>Total reputation: {prop.reputation}</p>
                <p>Total photos rated: {prop.totalPhotosRated}</p>
                <p>Photos uploaded: {prop.uploaded}</p>
                <p>
                    Best rated photo:{" "}
                    {prop.bestRatedPhoto.photoUrl ? (
                        <a href={prop.bestRatedPhoto.photoUrl} target="_blank">
                            Photo Link
                        </a>
                    ) : (
                        "None yet"
                    )}
                </p>
            </div>
        </div>
    );
}

export default Profile;
