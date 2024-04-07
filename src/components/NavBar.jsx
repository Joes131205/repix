function NavBar(prop) {
    return (
        <div className="w-screen flex items-center gap-5">
            <img
                src={prop.profilePicture}
                alt="Profile Picture"
                className="w-10 h-10 rounded-full"
            />
            <h1>{prop.username}</h1>
        </div>
    );
}

export default NavBar;
