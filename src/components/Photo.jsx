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
import { getAuth } from "firebase/auth";

function Photo() {
    const [currentPhoto, setCurrentPhoto] = useState({});

    const db = getFirestore(app);

    const user = getAuth();
    const uid = user.currentUser.uid;
    async function fetchRandomPhoto() {
        const photosCollection = collection(db, "photos");
        const querySnapshot = await getDocs(photosCollection);

        if (querySnapshot.size === 0) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * querySnapshot.size);

        const randomPhotoDoc = querySnapshot.docs[randomIndex];

        const data = await randomPhotoDoc.data();

        console.log(data);
    }
    useEffect(() => {
        fetchRandomPhoto();
    }, []);
    return <div></div>;
}

export default Photo;
