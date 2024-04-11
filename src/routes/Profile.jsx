import { doc, getDoc, getFirestore } from "firebase/firestore";

import app from "../firebase";

function Profile(prop) {
    const db = getFirestore(app);
    const docRef = doc(db, "users", prop.uid);
    const docSnap = getDoc(docRef);
    const data = docSnap.data();

    return (
        <div>
            <h1>Profile</h1>
            <div>
                <img
                    src={prop.profilePicture}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full"
                />
                <h2>{prop.username}</h2>
            </div>
            <div>
                <p>Total reputation: </p>
                <p>Total photos rated: </p>
                <p>Photos uploaded: </p>
                <p>Best rating photo: </p>
            </div>
        </div>
    );
}

export default Profile;
