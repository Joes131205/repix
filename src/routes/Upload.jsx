import {
    getFirestore,
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";

function Upload() {
    const db = getFirestore();
    const [photoReview, setPhotoReview] = useState("");
    const [photo, setPhoto] = useState("");

    async function uploadPhoto(prop) {
        const docCollection = collection(db, "photos");
        await addDoc(docCollection, {
            photo: photo,
            uid: prop.uid,
            createdAt: serverTimestamp(),
        });
    }

    async function previewImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPhotoReview(reader.result);
        };

        const newFilename = `${auth.currentUser.uid}.${file.name
            .split(".")
            .pop()}`;
        const newBlob = new Blob([file], {
            type: file.type,
        });

        newBlob.name = newFilename;
        setPhoto(newBlob);
        reader.readAsDataURL(file);
    }

    return (
        <div>
            <h1>Upload Photos</h1>
            <input type="file" onChange={previewImage} />
            <img src={photoReview} alt="" />
            <button onClick={uploadPhoto}>Upload!</button>
        </div>
    );
}

export default Upload;
