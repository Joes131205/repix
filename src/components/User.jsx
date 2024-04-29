function User(prop) {
    return (
        <div className="flex gap-10 items-center">
            <p>{prop.rank}.</p>
            <div className="flex gap-5 items-center">
                <img src={prop.profilePicture} className="w-10 rounded-full" />
                <p>{prop.username}</p>
                <p>{prop.reputation}</p>
            </div>
        </div>
    );
}

export default User;
