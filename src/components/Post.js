import React, { useEffect, useState } from "react";
import "./Post.css";
import * as firebase from "firebase";
import { db } from "./firebase";
import Avatar from "@material-ui/core/Avatar";

function Post({ username, caption, imageUrl, postId ,user }) {
  const [comments, setComments] = useState([]);
  const [commnet, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comment")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postCommnet = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comment").add({
      text: commnet,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className="post_img" src={imageUrl} alt="" />
      <h4 className="post_text">
        <strong>{username}</strong>:{caption}
      </h4>
      {
        <div className="post__comments">
          {comments.map((item) => (
            <p>
              <strong>{item.username}</strong> {item.text}
            </p>
          ))}
        </div>
      }

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="add comments....."
            value={commnet}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!commnet}
            className="post__button"
            type="submit"
            onClick={postCommnet}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
