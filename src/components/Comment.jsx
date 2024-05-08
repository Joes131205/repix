import { useEffect, useState } from "react";
import CommentUser from "../components/CommentUser";

import { db, storage, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, Bounce } from "react-toastify";

function Comment(prop) {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
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
        if (prop.photo?.comments) {
            setComments(prop.photo.comments);
        } else {
            setComments([]);
        }
    }, [prop.photo]);
    return (
        <div className="text-center">
            <div className="flex gap-10 mb-5">
                <input
                    type="text"
                    placeholder="Have any comment? (Optional)"
                    className="w-96 border border-black px-2 py-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={sendComment}>Comment</button>
            </div>

            <div className="flex flex-col gap-10">
                {comments.map((comment, i) => (
                    <CommentUser
                        comment={comment.comment}
                        uid={comment.uid}
                        key={i}
                    />
                ))}
            </div>
        </div>
    );
}

export default Comment;
