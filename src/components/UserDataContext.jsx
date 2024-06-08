import { createContext, useState, useEffect } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const UserDataContext = createContext();

const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        username: "",
        uploaded: 0,
        reputation: 0,
        totalPhotosRated: 0,
        totalPhotosDaily: {
            rated: 0,
            uploaded: 0,
            timeLastRated: "",
            timeLastUploaded: "",
        },
        ratedPhotos: [],
        profilePhotoUrl: "",
        uid: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userDocRef = doc(collection(db, "users"), user.uid);

                const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists) {
                        setUserData(doc.data());
                    }
                });
                return () => unsubscribeFirestore();
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);
    const updateUserData = async (newData) => {
        try {
            const userDocRef = doc(db, "users", userData.uid); // Ensure "users" is the correct collection name
            await updateDoc(userDocRef, newData);
            setUserData({ ...userData, ...newData });
        } catch (error) {
            console.error("Error updating user data in Firestore:", error);
        }
    };

    return (
        <UserDataContext.Provider
            value={{
                userData,
                updateUserData,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
};

export { UserDataContext, UserDataProvider };
