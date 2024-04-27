import {
    getFirestore,
    addDoc,
    setDoc,
    collection,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useState } from "react";

import app from "../firebase";

import { toast, Bounce } from "react-toastify";

function Upload(prop) {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const [photoReview, setPhotoReview] = useState("");
    const [photo, setPhoto] = useState("");

    async function incrementUpload() {
        try {
            const docRef = doc(db, "users", prop.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            await updateDoc(docRef, {
                uploaded: data.uploaded + 1,
            });
            console.log("updated");
        } catch (error) {
            console.error("Error updating photo reputation:", error);
        }
    }

    async function uploadPhoto() {
        try {
            toast.info("Uploading...", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });

            const timestamp = Date.now();
            const filename = `${timestamp}-${prop.uid}.${photo.name
                .split(".")
                .pop()}`;
            const photoRef = ref(storage, `photos/${filename}`);
            await uploadBytes(photoRef, photo);

            const photoUrl = await getDownloadURL(photoRef);

            const docCollection = collection(db, "photos");
            await addDoc(docCollection, {
                photoUrl,
                uid: prop.uid,
                createdAt: serverTimestamp(),
                reputation: 0,
                rated: [],
                comments: [],
            });

            toast.success("Uploaded!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        } catch (error) {
            console.error("Error uploading photo:", error);
            toast.error("Upload failed!", {
                position: "bottom-right",
                autoClose: 0,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
        incrementUpload();
    }

    async function previewImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPhotoReview(reader.result);
        };

        const newFilename = `${prop.uid}.${file.name.split(".").pop()}`;
        const newBlob = new Blob([file], {
            type: file.type,
        });

        newBlob.name = newFilename;
        setPhoto(newBlob);
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center gap-10">
            <h1>Upload Photos</h1>
            <input type="file" onChange={previewImage} accept="image/png" />
            <img
                src={photoReview || "/images/placeholder.png"}
                className="w-96 h-96"
            />
            <button onClick={uploadPhoto}>Upload!</button>
        </div>
    );
}

export default Upload;
