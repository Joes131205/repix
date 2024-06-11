import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState, useContext } from "react";

import { db, storage, auth } from "../firebase";

import { useNavigate, Link } from "react-router-dom";

import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserDataContext } from "../components/UserDataContext";

function Setting() {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [profilePictureReview, setProfilePictureReview] = useState("");
    const [error, setError] = useState("");
    const { userData } = useContext(UserDataContext);

    const navigate = useNavigate();

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
        } catch (error) {
            setError(error);
        }
    }

    async function changeProfilePicture(image) {
        if (profilePicture) {
            try {
                const storageRef = ref(
                    storage,
                    `profile-pictures/${image.name}`
                );
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
                const userRef = doc(db, "users", userData.uid);
                const profilePictureUrl = await getDownloadURL(storageRef);

                await updateDoc(userRef, {
                    profilePhotoUrl: profilePictureUrl,
                });
            } catch (error) {
                setError(error);
            }
        } else {
            toast.error("Please provide a valid profile picture!", {
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
                setUsername(userData.username);
                setProfilePictureReview(userData.profilePhotoUrl);
            } else {
                navigate("/signup");
            }
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-10">
            <h1 className="font-bold text-2xl">Setting</h1>
            <div className="w-screen flex flex-col items-center gap-10 justify-center">
                <img
                    src={profilePictureReview || "/images/placeholder.png"}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full"
                />
            </div>
            <div className="w-screen flex flex-col items-center gap-2 justify-center">
                <label htmlFor="username" className="font-bold">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="text-black bg-gray-50 border border-gray-500 rounded px-4 py-2"
                    placeholder="Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    onClick={() => changeUsername(username)}
                    className="border-2 border-black px-5 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded transition dark:[#4a4a4a] dark:hover:bg-[#5a5a5a] dark:text-black"
                >
                    Change Username
                </button>
            </div>

            <div className="flex flex-col items-center gap-2 justify-center">
                <label htmlFor="profilePicture" className="font-bold">
                    Profile Picture
                </label>
                <input
                    type="file"
                    name="profilePicture"
                    id="profilePicture"
                    onChange={
                        changeProfilePictureReview || "/images/placeholder.png"
                    }
                    accept="image/png"
                />
                <button
                    onClick={() => changeProfilePicture(profilePicture)}
                    className="border-2 border-black px-5 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded transition dark:[#4a4a4a] dark:hover:bg-[#5a5a5a] dark:text-black"
                >
                    Change Profile Picture
                </button>
            </div>
            <p className="text-red-800">{error}</p>
            <Link
                to="/"
                className="bg-red-700 px-4 py-2 rounded-lg font-bold hover:bg-red-900 transition"
            >
                Go back
            </Link>
        </div>
    );
}

export default Setting;
