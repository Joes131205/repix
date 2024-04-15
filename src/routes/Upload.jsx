import {
    getFirestore,
    addDoc,
    collection,
    serverTimestamp,
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

            const photoRef = ref(storage, `photos/${prop.uid}.jpg`);
            await uploadBytes(photoRef, photo);

            const photoUrl = await getDownloadURL(photoRef);

            const docCollection = collection(db, "photos");
            await addDoc(docCollection, {
                photoUrl,
                uid: prop.uid,
                createdAt: serverTimestamp(),
                reputation: 0,
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
        <div>
            <h1>Upload Photos</h1>
            <input type="file" onChange={previewImage} />
            <img
                src={photoReview || "public/images/placeholder.png"}
                className="w-96 h-96"
            />
            <button onClick={uploadPhoto}>Upload!</button>
        </div>
    );
}

export default Upload;
