import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";

import { db, storage, auth } from "../firebase";

import { useNavigate, Link } from "react-router-dom";

import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Setting() {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [profilePictureReview, setProfilePictureReview] = useState("");

    const navigate = useNavigate();

    async function fetchUserName(uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setUsername(data.username);
    }

    async function fetchProfilePicture(uid) {
        const storageRef = ref(storage, `profile-pictures/${uid}.png`);
        const url = await getDownloadURL(storageRef);
        setProfilePictureReview(url);
    }

    async function changeUsername() {
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, {
                username: username,
            });
            toast.success("Changed Username!", {
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
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    async function changeProfilePicture(image) {
        const storageRef = ref(storage, `profile-pictures/${image.name}`);
        await uploadBytes(storageRef, image);
        toast.success("Changed Profile Picture!", {
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
        window.location.reload();
    }

    async function changeProfilePictureReview(e) {
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onloadend = () => {
            setProfilePictureReview(reader.result);
        };

        const newFilename = `${auth.currentUser.uid}.${file.name
            .split(".")
            .pop()}`;
        const newBlob = new Blob([file], {
            type: file.type,
        });

        newBlob.name = newFilename;
        setProfilePicture(newBlob);
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await fetchUserName(user.uid);
                await fetchProfilePicture(user.uid);
            } else {
                navigate("/signup");
            }
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-10">
            <h1>Setting</h1>
            <div className="w-screen flex items-center gap-10 justify-center">
                <img
                    src={profilePictureReview || "/images/placeholder.png"}
                    alt="Profile Picture"
                    className="w-10 h-10 rounded-full"
                />
            </div>
            <div className="w-screen flex items-center gap-10 justify-center">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    placeholder="Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={() => changeUsername(username)}>
                    Change Username
                </button>
            </div>

            <div>
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                    type="file"
                    name="profilePicture"
                    onChange={
                        changeProfilePictureReview || "/images/placeholder.png"
                    }
                    accept="image/png"
                />
                <button onClick={() => changeProfilePicture(profilePicture)}>
                    Change Profile Picture
                </button>
            </div>
            <Link to="/">Go back</Link>
        </div>
    );
}

export default Setting;
