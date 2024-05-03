import { useEffect, useState } from "react";

function Profile(prop) {
    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        setPhotos(prop.photos);
        console.log(prop.photos);
    }, [prop]);
    return (
        <div className=" flex flex-col items-center justify-center text-center gap-10">
            <h1>Profile</h1>
            <div>
                <img
                    src={prop.profilePicture || "/images/placeholder.png"}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full"
                />
                <h2>{prop.username}</h2>
            </div>
            <div className="flex flex-col gap-5">
                <p>Total reputation: {prop.reputation}</p>
                <p>Total photos rated: {prop.totalPhotosRated}</p>
                <p>Photos uploaded: {prop.uploaded}</p>
                <div>
                    {photos
                        ? photos.map((photo) => (
                              <img
                                  src={photo.photoUrl}
                                  alt="Photo"
                                  className="w-96 h-96 max-w-96 max-h-96"
                              />
                          ))
                        : "None yet"}
                </div>
            </div>
        </div>
    );
}

export default Profile;
