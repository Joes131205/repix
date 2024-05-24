import { createContext, useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";

import { auth, db, storage } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userDocRef = doc(collection(db, "users"), user.uid);

                const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists) {
                        setUserData(doc.data());
                    } else {
                        console.error("User document not found in Firestore");
                    }
                });
                return () => unsubscribeFirestore();
            }
            return unsubscribe;
        });

        return () => {
            unsubscribe();
        };
    }, [app]);

    const updateUserData = async (newData) => {
        const userDocRef = doc(
            collection(db, "users"),
            getAuth(app).currentUser.uid
        );

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

export { userDataContext, userDataProvider };
