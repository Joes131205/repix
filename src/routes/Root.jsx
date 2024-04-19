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
        console.log(currentPhoto);
        const ref = doc(db, "photos", currentPhoto.id);
        const updatedRated = [...currentPhoto.rated, uid];
        try {
            await updateDoc(ref, {
                reputation: currentPhoto.reputation,
                rated: updatedRated,
            });
            console.log("Photo reputation updated successfully!");
        } catch (error) {
            console.error("Error updating photo reputation:", error);
        }
    }

    async function rate() {
        const ratingAdjustments = {
            1: () => Math.floor(Math.random() * -9) - 5,
            2: () => Math.floor(Math.random() * -4) - 1,
            3: () => 0,
            4: () => Math.floor(Math.random() * 6) + 1,
            default: () => Math.floor(Math.random() * 11) + 1,
        };

        const adjustmentFunction =
            ratingAdjustments[rating] || ratingAdjustments.default;
        const currRating = adjustmentFunction();

        setCurrentPhoto({
            ...currentPhoto,
            reputation: currentPhoto.reputation + currRating,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await updatePhoto();
        console.log("updated");
    }
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
