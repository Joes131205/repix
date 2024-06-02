import {
    addDoc,
    collection,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useState, useContext } from "react";

import { db, storage, auth } from "../firebase";

import { toast, Bounce } from "react-toastify";

import { UserDataContext } from "../components/UserDataContext";

function Upload() {
    const [photoReview, setPhotoReview] = useState("");
    const [photo, setPhoto] = useState("");

    const { userData } = useContext(UserDataContext);

    async function incrementUpload() {
        try {
            const docRef = doc(db, "users", userData.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            await updateDoc(docRef, {
                uploaded: data.uploaded + 1,
            });
            console.log("updated");
            const isNewDay =
                !data.totalPhotosDaily.timeLastUploaded ||
                today.getDate() !==
                    new Date(data.totalPhotosDaily.timeLastUploaded).getDate();
            if (isNewDay) {
                data.totalPhotosDaily.uploaded = 0;
                data.totalPhotosDaily.timeLastUploaded = today.toISOString();
            }
            const today = new Date();

            await updateDoc(docRef, {
                totalPhotosRated: data.totalPhotosRated + 1,
                totalPhotosDaily: {
                    uploaded: data.totalPhotosDaily.uploaded + 1,
                    timeLastUploaded: data.totalPhotosDaily.timeLastUploaded,
                },
            });
        } catch (error) {
            console.error("Error updating photo reputation:", error);
        }
    }

    async function uploadPhoto() {
        if (userData.totalPhotosDaily.uploaded > 3) {
            toast.error(
                "You have already uploaded 3 photos today. Try again tomorrow.",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                }
            );
            return;
        } else {
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
                const filename = `${timestamp}-${userData.uid}.${photo.name
                    .split(".")
                    .pop()}`;
                const photoRef = ref(storage, `photos/${filename}`);
                await uploadBytes(photoRef, photo);

                const photoUrl = await getDownloadURL(photoRef);

                const docCollection = collection(db, "photos");
                await addDoc(docCollection, {
                    photoUrl,
                    uid: userData.uid,
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
    }

    async function previewImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPhotoReview(reader.result);
        };

        const newFilename = `${userData.uid}.${file.name.split(".").pop()}`;
        const newBlob = new Blob([file], {
            type: file.type,
        });

        newBlob.name = newFilename;
        setPhoto(newBlob);
    }

    return (
        <div className=" flex flex-col items-center justify-center gap-10">
            <h1 className="text-2xl font-bold">Upload Photo</h1>
            <p>NOTE: We only accepts PNG :)</p>
            <input type="file" onChange={previewImage} accept="image/png" />
            <img
                src={photoReview || "/images/placeholder.png"}
                className="w-96 h-96 max-w-96 max-h-96 rounded-md border-4 border-black dark:border-gray-500"
            />
            <button
                onClick={uploadPhoto}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
            >
                Upload!
            </button>
        </div>
    );
}

export default Upload;
