import { useEffect, useState } from "react";
import CommentUser from "../components/CommentUser";

import app from "../firebase";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, Bounce } from "react-toastify";

function Comment(prop) {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const db = getFirestore(app);
    console.log(prop.photo.id);
    async function sendComment() {
        if (comment) {
            const docRef = doc(db, "photos", prop.photo.id);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            await updateDoc(docRef, {
                comments: [
                    ...data.comments,
                    { uid: prop.uid, comment: comment },
                ],
            });
            toast.success(`Commented!`, {
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
            setComments([...comments, comment]);
            setComment("");
        }
    }
    useEffect(() => {
        console.log(prop.photo);
    }, [prop.photo]);
    return (
        <div className="text-center">
            <div className="flex gap-10">
                <input
                    type="text"
                    placeholder="Have any comment? (Optional)"
                    className="w-96 border border-black px-2 py-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={sendComment}>Comment</button>
            </div>

            <div>
                {comments.map((comment) => (
                    <CommentUser comment={comment.comment} />
                ))}
            </div>
        </div>
    );
}

export default Comment;
