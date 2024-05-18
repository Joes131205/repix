import { useEffect, useState } from "react";

import Photo from "../components/Photo";

function Profile(prop) {
    const [photos, setPhotos] = useState([]);
    const [textHover, setTextHover] = useState("");
    const [hover, setHover] = useState(false);
    async function onHover(e) {
        setHover(true);
    }
    async function onHoverOver(e) {
        setHover(false);
    }

    useEffect(() => {
        setPhotos(prop.photos);
    }, [prop]);
    return (
        <div className=" flex flex-col items-center justify-center text-center gap-10 mb-14">
            <h1 className="font-bold text-2xl">Your Profile</h1>
            <div className="flex flex-col gap-2">
                <img
                    src={prop.profilePicture || "/images/placeholder.png"}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full"
                />
                <h2 className="font-bold text-xl">{prop.username}</h2>
            </div>

            <div className="flex flex-col gap-5 ">
                <p>Total reputation: {prop.reputation}</p>
                <p>Total photos rated: {prop.totalPhotosRated}</p>
                <p>Photos uploaded: {prop.uploaded}</p>
                <div className="flex flex-col gap-10">
                    <h2 className="text-2xl font-bold">
                        Your Photos (From most rated to least)
                    </h2>
                    <div className="flex gap-10 flex-wrap items-center justify-center">
                        {photos
                            ? photos.map((photo) => (
                                  <div
                                      key={`${photo.id}_${photo.createdAt}`}
                                      className="w-96 h-96 max-w-96 max-h-96 rounded-md border-4 border-black dark:border-gray-500 hover:brightness-50 hover:backdrop-brightness-50"
                                      style={{
                                          backgroundImage: `url('${photo.photoUrl}')`,
                                          backgroundSize: "cover",
                                          backgroundRepeat: "no-repeat",
                                      }}
                                      onMouseEnter={onHover}
                                      onMouseLeave={onHoverOver}
                                  ></div>
                              ))
                            : "None yet"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
