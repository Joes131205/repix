import { useEffect, useState } from "react";

import Photo from "../components/Photo";

function Profile(prop) {
    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        setPhotos(prop.photos);
    }, [prop]);
    return (
        <div className=" flex flex-col items-center justify-center text-center gap-10">
            <h1 className="font-bold text-2xl">Your Profile</h1>
            <div className="flex flex-col gap-2">
                <img
                    src={prop.profilePicture || "/images/placeholder.png"}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full"
                />
                <h2 className="font-bold">{prop.username}</h2>
            </div>
            <div className="flex flex-col gap-5">
                <p>Total reputation: {prop.reputation}</p>
                <p>Total photos rated: {prop.totalPhotosRated}</p>
                <p>Photos uploaded: {prop.uploaded}</p>
                <div className="flex gap-10">
                    {photos
                        ? photos.map((photo) => (
                              <Photo key={photo.id} url={photo.photoUrl} />
                          ))
                        : "None yet"}
                </div>
            </div>
        </div>
    );
}

export default Profile;
