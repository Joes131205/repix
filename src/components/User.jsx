function User(prop) {
    return (
        <div className="flex gap-10">
            <p>{prop.rank}.</p>
            <div className="flex gap-5">
                <img src={prop.profilePicture} />
                <p>{prop.username}</p>
                <p>{prop.reputation}</p>
            </div>
        </div>
    );
}

export default User;
