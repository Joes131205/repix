import { useEffect, useState, useContext } from "react";
import { UserDataContext } from "../components/UserDataContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Profile() {
    const { userData } = useContext(UserDataContext);
    const [photos, setPhotos] = useState([]);

    async function getAllPhotos() {
        const photosCollection = collection(db, "photos");
        const querySnapshot = await getDocs(photosCollection);
        if (querySnapshot.length === 0) return;
        const photoData = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.uid === userData.uid) {
                setPhotos((prev) => [...prev, data]);
            }
        });
    }

    useEffect(() => {
        getAllPhotos();
    }, []);

    return (
        <div className=" flex flex-col items-center justify-center text-center gap-10 mb-14">
            <h1 className="font-bold text-2xl">Your Profile</h1>
            <div className="flex flex-col gap-2 items-center">
                <img
                    src={userData.profilePhotoUrl || "/images/placeholder.png"}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full"
                />
                <h2 className="font-bold text-xl">{userData.username}</h2>
            </div>

            <div className="flex flex-col gap-5 ">
                <p>Total reputation: {userData.reputation}</p>
                <p>Total photos rated: {userData.totalPhotosRated}</p>
                <p>Photos uploaded: {userData.uploaded}</p>
                <div className="flex flex-col gap-10">
                    <h2 className="text-2xl font-bold">Your Photos</h2>
                    <div className="flex gap-10 flex-wrap items-center justify-center">
                        {photos.length ? (
                            photos.map((photo, i) => (
                                <a
                                    href={photo.photoUrl}
                                    target="_blank"
                                    key={i}
                                >
                                    <div
                                        key={`${photo.id}_${photo.createdAt}`}
                                        className="w-96 h-96 max-w-96 max-h-96 rounded-md border-4 border-black dark:border-gray-500 flex flex-col items-center justify-center text-transparent hover:text-white bg-blend-darken hover:bg-[#000000de] transition select-none"
                                        style={{
                                            backgroundImage: `url('${photo.photoUrl}')`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    >
                                        <div>
                                            <p>
                                                Reputation: {photo.reputation}
                                            </p>
                                            <p>
                                                Created At:{" "}
                                                {new Intl.DateTimeFormat(
                                                    navigator.language,
                                                    {
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        day: "numeric",
                                                        month: "numeric",
                                                        year: "numeric",
                                                        weekday: "long",
                                                    }
                                                ).format(
                                                    photo.createdAt.seconds *
                                                        1000
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <p>None yet!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
