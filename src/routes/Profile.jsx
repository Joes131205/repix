import { useEffect, useState } from "react";

function Profile(prop) {
    const { userData } = useContext(UserDataContext);

    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        setPhotos(prop.photos.sort((a, b) => b.reputation - a.reputation));
    }, [prop]);

    return (
        <div className=" flex flex-col items-center justify-center text-center gap-10 mb-14">
            <h1 className="font-bold text-2xl">Your Profile</h1>
            <div className="flex flex-col gap-2">
                <img
                    src={
                        userData.profilePictureUrl || "/images/placeholder.png"
                    }
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
                    <h2 className="text-2xl font-bold">
                        Your Photos (From most rated to least)
                    </h2>
                    <div className="flex gap-10 flex-wrap items-center justify-center">
                        {photos
                            ? photos.map((photo) => (
                                  <div
                                      key={`${photo.id}_${photo.createdAt}`}
                                      className="w-96 h-96 max-w-96 max-h-96 rounded-md border-4 border-black dark:border-gray-500 flex flex-col items-center justify-center text-transparent hover:text-white bg-blend-darken hover:bg-[#000000de] transition select-none"
                                      style={{
                                          backgroundImage: `url('${photo.photoUrl}')`,
                                          backgroundSize: "cover",
                                          backgroundRepeat: "no-repeat",
                                      }}
                                  >
                                      <div className="">
                                          <p>Reputation: {photo.reputation}</p>
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
                                                  photo.createdAt.seconds * 1000
                                              )}
                                          </p>
                                      </div>
                                  </div>
                              ))
                            : "None yet"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
