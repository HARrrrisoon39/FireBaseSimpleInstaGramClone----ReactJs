import React, { useState } from "react";
import { db, storage } from './components/firebase';

function Upload({username}) {
  const [caption, setcaption] = useState("");
  //   const [progress, setprogress] = useState(0);
  const [image, setimage] = useState(null);
  //   const [imageAsUrl, setImageAsUrl] = useState(allImputs);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setimage(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`/images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        console.log(snapShot);
      },
      (err) => {
        console.log(err);
        alert(err.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({ 
                caption : caption,
                imageUrl : url,
                username : username,
            });
            setcaption("")
            setimage(null)
          });
      }
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="enter the caption....."
        value={caption}
        onChange={(event) => setcaption(event.target.value)}
      ></input>
      <input onClick={handleChange} type="file"></input>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;
