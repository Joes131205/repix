import Photo from "../components/Photo";
import Comment from "../components/Comment";

import {
    getDocs,
    collection,
    updateDoc,
    doc,
    getDoc,
} from "firebase/firestore";

import { useEffect, useState, useContext } from "react";

import { db } from "../firebase";

import Stars from "../components/Stars";

import { toast, Bounce } from "react-toastify";

import { UserDataContext } from "../components/UserDataContext";
function Root() {
    const [currentPhoto, setCurrentPhoto] = useState({});
    const [rating, setRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState("");
    const { userData } = useContext(UserDataContext);

    async function fetchRandomPhoto() {
        setError("");
        setCurrentPhoto({});

        setIsLoading(true);
        setAttempts(0);

        const photosCollection = collection(db, "photos");

        try {
            const querySnapshot = await getDocs(photosCollection);
            if (querySnapshot.empty) {
                setIsLoading(false);
                return;
            }

            const filteredData = [];
            for (const doc of querySnapshot.docs) {
                if (doc.exists) {
                    filteredData.push({ ...doc.data(), id: doc.id });
                } else {
                    throw Error(
                        "Error occurred while fetching photo, try again!"
                    );
                }
            }
            const photo = getRandomPhotoWithoutDuplicates(
                filteredData,
                userData.uid,
                userData.ratedPhotos
            );
            if (photo) {
                setCurrentPhoto(photo);
            } else {
                setCurrentPhoto({});
                return;
            }
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
            setAttempts(attempts + 1);
        }
    }

    function getRandomPhotoWithoutDuplicates(data, user, ratedPhotos) {
        setCurrentPhoto({});
        const excludedPhotos = [];

        while (excludedPhotos.length < data.length) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const photo = data[randomIndex];
            if (
                photo.uid !== user &&
                (ratedPhotos === undefined ||
                    !ratedPhotos.includes(photo.id)) &&
                (!photo.rated || !photo.rated.includes(user)) &&
                !excludedPhotos.includes(photo.id)
            ) {
                return photo;
            } else {
            }
            data.splice(randomIndex, 1);

            excludedPhotos.push(photo.id);
        }
        return {};
    }
    async function updatePhoto(data) {
        const ref = doc(db, "photos", currentPhoto.id);
        try {
            await updateDoc(ref, data);
        } catch (error) {
            setError(
                "Error occurred while updating photo photo, try again!",
                doc.id
            );
        }
        setRating(0);
    }

    async function updateProfile() {
        try {
            const today = new Date();

            const docRef = doc(db, "users", userData.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();

            const isNewDay =
                !data.totalPhotosDaily.timeLastRated ||
                today.getDate() !==
                    new Date(data.totalPhotosDaily.timeLastRated).getDate();
            if (isNewDay) {
                data.totalPhotosDaily.lastRated = 0;
                data.totalPhotosDaily.timeLastRated = today.toISOString();
            }

            await updateDoc(docRef, {
                totalPhotosRated: data.totalPhotosRated + 1,
                totalPhotosDaily: {
                    ...data.totalPhotosDaily,
                    lastRated: data.totalPhotosDaily.lastRated + 1,
                    timeLastRated: data.totalPhotosDaily.timeLastRated,
                },
                ratedPhotos: [...(data.ratedPhotos || []), currentPhoto.id],
            });
        } catch (error) {
            setError(error);
        }
    }
    async function updateOtherProfile(rating) {
        try {
            const docRef = doc(db, "users", currentPhoto.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            await updateDoc(docRef, {
                ...data,
                reputation: data.reputation + rating,
            });
        } catch (error) {
            setError(error);
        }
    }

    async function rate() {
        if (userData.totalPhotosDaily.lastRated > 9) {
            toast.error(
                "You have already rated 10 photos today. Try again tomorrow.",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                }
            );
            return;
        }
        if (rating) {
            setError("");
            const ratingAdjustments = {
                1: () => Math.floor(Math.random() * (10 - 6 + 1)) + 6, // -6 to -10
                2: () => Math.floor(Math.random() * (5 - 1 + 1)) + 1, // -1 to -5
                3: () => 0,
                4: () => Math.floor(Math.random() * (5 + 1)) + 1, // 1 to 5
                5: () => Math.floor(Math.random() * (10 - 6 + 1)) + 6, // 6 to 10
            };

            const adjustmentFunction =
                ratingAdjustments[rating] || ratingAdjustments.default;
            const currRating = adjustmentFunction();

            const updatedRated = [...currentPhoto.rated, userData.uid];
            const updatedData = {
                ...currentPhoto,
                reputation: currentPhoto.reputation + currRating,
                rated: updatedRated,
            };
            await updatePhoto(updatedData);
            await updateProfile();
            await updateOtherProfile(currRating);

            toast.success(`Rated ${rating} Star${rating === 1 ? "" : "s"}!`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            setRating(0);
            await fetchRandomPhoto();
        }
    }

    useEffect(() => {
        setCurrentPhoto({});
        fetchRandomPhoto();
    }, [userData]);

    return (
        <div className="flex flex-col items-center justify-center gap-10 h-screen">
            {userData.totalPhotosDaily.lastRated > 9 ? (
                <p>
                    Reached a maximum amount of photos rated for today (10),
                    come back tomorrow!
                </p>
            ) : isLoading ? (
                <div>Loading...</div>
            ) : currentPhoto?.photoUrl ? (
                <>
                    <Photo url={currentPhoto?.photoUrl ?? ""} />
                    <Stars setRating={setRating} rating={rating} />
                    <button
                        onClick={rate}
                        disabled={isLoading}
                        className="bg-yellow-600 hover:bg-yellow-900 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Rate!
                    </button>
                    <Comment photo={currentPhoto} uid={userData.uid} />
                </>
            ) : (
                <>
                    <p className="text-red-800">{error}</p>
                    <p>No photos left :(</p>
                </>
            )}
        </div>
    );
}

export default Root;
