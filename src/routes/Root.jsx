import Photo from "../components/Photo";
import Comment from "../components/Comment";

import {
    getFirestore,
    query,
    where,
    getDocs,
    collection,
    getDoc,
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
        }

        setCurrentPhoto(data);
        console.log(data);
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

        console.log(currRating);
        return currRating;
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
