function User(prop) {
    return (
        <div className="flex gap-10">
            <img src={prop.profilePicture} />
            <p>{prop.username}</p>
            <p>{prop.reputation}</p>
        </div>
    );
}

export default User;
