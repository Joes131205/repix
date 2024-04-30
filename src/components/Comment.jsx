import { useState } from "react";
import UserComment from "../components/CommentUser";

function Comment(prop) {
    const [comment, setComment] = useState("");
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
                <button>Comment</button>
            </div>

            {/* <div>{prop.comments ? prop.comments.map((com) => {
                <UserComment 
                    name={com.name}
                    comment={com.comment}
                />
            }) : ""}</div> */}
        </div>
    );
}

export default Comment;
