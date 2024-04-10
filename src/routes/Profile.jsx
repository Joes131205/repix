function Profile(prop) {
    return (
        <div>
            <h1>Profile</h1>
            <div>
                <img src={prop.profilePicture} alt="Profile Picture" />
                <h2>{prop.username}</h2>
            </div>
            <div>
                <p>Total reputation: </p>
                <p>Total rated: </p>
                <p>Photos uploaded: </p>
                <p>Best rating photo: </p>
            </div>
        </div>
    );
}

export default Profile;
