import {
    addDoc,
    collection,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useState, useContext, useEffect } from "react";

import { db, storage, auth } from "../firebase";

import { toast, Bounce } from "react-toastify";

import { UserDataContext } from "../components/UserDataContext";

function Upload() {
    const { userData, updateUserData } = useContext(UserDataContext);
    const [photoReview, setPhotoReview] = useState("");
    const [photo, setPhoto] = useState("");

    async function incrementUpload() {
        try {
            const docRef = doc(db, "users", userData.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            const today = new Date();

            await updateDoc(docRef, {
                uploaded: data.uploaded + 1,
            });
            const isNewDay =
                !data.totalPhotosDaily.timeLastUploaded ||
                today.getDate() !==
                    new Date(data.totalPhotosDaily.timeLastUploaded).getDate();
            if (isNewDay) {
                data.totalPhotosDaily.lastUploaded = 0;
                data.totalPhotosDaily.timeLastUploaded = today.toISOString();
            }
            await updateDoc(docRef, {
                totalPhotosDaily: {
                    ...data.totalPhotosDaily,
                    lastUploaded: data.totalPhotosDaily.lastUploaded + 1,
                    timeLastUploaded: data.totalPhotosDaily.timeLastUploaded,
                },
            });
        } catch (error) {
            toast.error("Error occurred, try again! ", {
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
        }
    }

    async function uploadPhoto() {
        if (userData.totalPhotosDaily.lastUploaded > 2) {
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
                toast.error("Upload failed! Try again!", {
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
            await incrementUpload();
            setPhotoReview("");
            setPhoto("");
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
        <div className="flex flex-col items-center justify-center gap-10 h-screen">
            {userData.totalPhotosDaily.uploaded > 2 ? (
                <p>
                    Reached maximum amount of photos you can upload for today,
                    come back tomorrow!
                </p>
            ) : (
                <>
                    <h1 className="text-2xl font-bold">Upload Photo</h1>
                    <p>NOTE: We only accepts PNG :)</p>
                    <input
                        type="file"
                        onChange={previewImage}
                        accept="image/png"
                    />
                    {photoReview ? (
                        <>
                            <img
                                src={photoReview}
                                className="w-96 h-96 max-w-96 max-h-96 rounded-md border-4 border-black dark:border-gray-500"
                            />
                            <button
                                onClick={uploadPhoto}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                            >
                                Upload!
                            </button>
                        </>
                    ) : (
                        ""
                    )}
                </>
            )}
        </div>
    );
}

export default Upload;
