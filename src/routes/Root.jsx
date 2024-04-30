import Photo from "../components/Photo";
import Comment from "../components/Comment";

import {
    getFirestore,
    getDocs,
    collection,
    updateDoc,
    doc,
    getDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import app from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Stars from "../components/Stars";

import { toast, Bounce } from "react-toastify";
function Root() {
    const [currentPhoto, setCurrentPhoto] = useState({});
    const [uid, setUid] = useState("");
    const [rating, setRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);

    const db = getFirestore(app);

    async function fetchRandomPhoto() {
        setIsLoading(true);
        setAttempts(0);
        const photosCollection = collection(db, "photos");
        const querySnapshot = await getDocs(photosCollection);

        if (querySnapshot.size === 0) {
            setIsLoading(false);
            return;
        }

        const randomIndex = Math.floor(Math.random() * querySnapshot.size);

        const randomPhotoDoc = querySnapshot.docs[randomIndex];
        console.log(randomIndex);
        const data = randomPhotoDoc.data();
        console.log(data);
        console.log(uid === data.uid);
        if (uid === data.uid) {
            console.log("same photo! attempt" + attempts);
            setAttempts((prev) => prev + 1);
            console.log(attempts);
            if (attempts >= 3) {
                return;
            }
            fetchRandomPhoto();
        } else {
            setCurrentPhoto({
                ...data,
                id: randomPhotoDoc.id,
            });

            setIsLoading(false);
        }
    }

    async function updatePhoto(data) {
        const ref = doc(db, "photos", currentPhoto.id);
        console.log(currentPhoto);
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
            console.error("Error updating photo reputation:", error);
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
            console.error("Error updating other profile reputation:", error);
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
            console.log(rating);
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
            await fetchRandomPhoto();
        }
    }

    useEffect(() => {
        console.log(currentPhoto);
    }, [currentPhoto]);

    useEffect(() => {
        fetchRandomPhoto();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
            if (user) {
                setUid(user.uid);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-10">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <Photo url={currentPhoto.photoUrl} />
            )}{" "}
            <Stars setRating={setRating} rating={rating} />
            <button onClick={rate} disabled={isLoading}>
                Rate!
            </button>{" "}
            <Comment photo={currentPhoto} uid={uid} />
        </div>
    );
}

export default Root;
