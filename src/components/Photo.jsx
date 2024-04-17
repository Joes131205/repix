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

import Stars from "./Stars";

function Photo() {
    const [currentPhoto, setCurrentPhoto] = useState({});
    const [uid, setUid] = useState("");

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
        console.log(currentPhoto);
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
            <h1>Photos</h1>
            <img src={currentPhoto.photoUrl} alt="" />
            <Stars />
        </div>
    );
}

export default Photo;
