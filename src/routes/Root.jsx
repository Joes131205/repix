import Photo from "../components/Photo";
import Comment from "../components/Comment";

import {
    getFirestore,
    query,
    where,
    getDocs,
    collection,
    getDoc,
    updateDoc,
    doc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import app from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Stars from "../components/Stars";

function Root() {
    const [currentPhoto, setCurrentPhoto] = useState({});
    const [uid, setUid] = useState("");
    const [rating, setRating] = useState(0);

    const db = getFirestore(app);

    async function fetchRandomPhoto() {
        console.log("fetching...");
        const photosCollection = collection(db, "photos");
        const querySnapshot = await getDocs(photosCollection);

        if (querySnapshot.size === 0) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * querySnapshot.size);

        const randomPhotoDoc = querySnapshot.docs[randomIndex];

        const data = randomPhotoDoc.data();

        if (uid === data.uid) {
            fetchRandomPhoto();
        } else {
            setCurrentPhoto({ ...data, id: randomPhotoDoc.id });
        }
    }

    async function updatePhoto() {
        const ref = doc(db, "photos", currentPhoto.id);
        console.log(currentPhoto);
        try {
            await updateDoc(ref, { ...currentPhoto });
            await fetchRandomPhoto();
            console.log("Photo reputation updated successfully!");
        } catch (error) {
            console.error("Error updating photo reputation:", error);
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
            setCurrentPhoto(updatedData);
            await updatePhoto();
        }
    }

    useEffect(() => {
        console.log("currentPhoto");
    }, [currentPhoto]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
            if (user) {
                setUid(user.uid);
                fetchRandomPhoto();
            }
        });
        return unsubscribe;
    }, []);

    return (
        <div>
            <Photo url={currentPhoto.photoUrl} />
            <Stars setRating={setRating} rating={rating} />
            <button onClick={rate}>Rate!</button>
            <Comment />
        </div>
    );
}

export default Root;
