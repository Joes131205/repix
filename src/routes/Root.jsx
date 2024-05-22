import Photo from "../components/Photo";
import Comment from "../components/Comment";

import {
    getDocs,
    collection,
    updateDoc,
    doc,
    getDoc,
    onSnapshot,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import { db, storage, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import Stars from "../components/Stars";

import { toast, Bounce } from "react-toastify";
function Root() {
    const [currentPhoto, setCurrentPhoto] = useState({});
    const [uid, setUid] = useState("");
    const [rating, setRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);

    async function fetchRandomPhoto() {
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
                    console.error("Document not found:", doc.id);
                }
            }

            const photo = getRandomPhotoWithoutDuplicates(filteredData, uid);
            if (photo) {
                setCurrentPhoto(photo);
            } else {
                console.log("No more photos to fetch.");
            }
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setIsLoading(false);
            setAttempts(attempts + 1);
        }
    }

    function getRandomPhotoWithoutDuplicates(data, uid) {
        let attempts = 0;
        while (attempts < data.length) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const photo = data[randomIndex];
            if (photo.uid !== uid) {
                return photo;
            }
            attempts++;
        }
        return null;
    }

    async function updatePhoto(data) {
        const ref = doc(db, "photos", currentPhoto.id);
        try {
            await updateDoc(ref, data);
            console.log("Photo reputation updated successfully!");
        } catch (error) {
            console.error("Error updating photo reputation:", error);
        }
        setRating(0);
    }

    async function updateProfile() {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            await updateDoc(docRef, {
                totalPhotosRated: data.totalPhotosRated + 1,
            });
        } catch (error) {
            console.error(error);
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
            console.error(error);
        }
    }

    async function rate() {
        if (rating) {
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

            const updatedRated = [...currentPhoto.rated, uid];
            const updatedData = {
                ...currentPhoto,
                reputation: currentPhoto.reputation + currRating,
                rated: updatedRated,
            };
            console.log(currRating);
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
        fetchRandomPhoto();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-10 mt-10">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <Photo url={currentPhoto?.photoUrl ?? ""} />
            )}{" "}
            <Stars setRating={setRating} rating={rating} />
            <button
                onClick={rate}
                disabled={isLoading}
                className="bg-yellow-600 hover:bg-yellow-900 text-white font-bold py-2 px-4 rounded transition"
            >
                Rate!
            </button>{" "}
            <Comment photo={currentPhoto} uid={uid} />
        </div>
    );
}

export default Root;
