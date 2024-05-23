import { createContext, useState, useEffect } from "react";
import { getFirestore, collection, doc, onSnapshot } from "firebase/firestore";

import app from "../firebase";

const userDataContext = createContext();

const userDataProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        username: "",
        uploaded: 0,
        reputation: 0,
        bestRatedPhoto: "",
        totalPhotosRated: 0,
        totalPhotosDaily: {
            rated: 0,
            uploaded: 0,
            timeLastRated: "",
            timeLastUploaded: "",
        },
    });

    useEffect(() => {
        const db = getFirestore(app);
        const userDocRef = doc(collection(db, "users"));

        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists) {
                setUserData(doc.data());
            } else {
                console.error("User document not found in Firestore");
            }
        });

        return unsubscribe;
    }, [app]);

    const updateUserData = async (newData) => {
        const db = getFirestore(app);
        const userDocRef = doc(collection(db, "users"));

        try {
            await doc(userDocRef).update(newData);
            setUserData({ ...userData, ...newData });
        } catch (error) {
            console.error("Error updating user data in Firestore:", error);
        }
    };

    return (
        <userDataContext.Provider value={{ userData, updateUserData }}>
            {children}
        </userDataContext.Provider>
    );
};

return { userDataContext, userDataProvider };
