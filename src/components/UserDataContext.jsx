import { createContext, useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const UserDataContext = createContext();

const UserDataProvider = ({ children }) => {
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
        uid: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Signed In");
                const userDocRef = doc(collection(db, "users"), user.uid);

                const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists) {
                        console.log(doc.data());
                        setUserData(doc.data());
                    } else {
                        console.error("User document not found in Firestore");
                    }
                });
                return () => unsubscribeFirestore();
            } else {
                console.log("No user signed in.");
            }
            return unsubscribe;
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const updateUserData = async (newData) => {
        const userDocRef = doc(
            collection(db, "users"),
            getAuth().currentUser.uid
        );

        try {
            await doc(userDocRef).update(newData);
            setUserData({ ...userData, ...newData });
            console.log(userData);
        } catch (error) {
            console.error("Error updating user data in Firestore:", error);
        }
    };

    console.log("Children passed to userDataProvider:", children);

    return (
        <UserDataContext.Provider value={{ userData, updateUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};

export { UserDataContext, UserDataProvider };
