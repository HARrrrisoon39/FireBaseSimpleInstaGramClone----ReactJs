import React, { useEffect, useState } from "react";
import "./App.css";
import { db, auth } from "./components/firebase";
import Post from "./components/Post";
import Modal from "@material-ui/core/Modal";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Input } from "@material-ui/core";
import Upload from "./components/Upload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setposts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSign, setopenSign] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts").onSnapshot((snapShot) => {
      setposts(
        snapShot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
      // setTodos(snapShot.docs.map((doc) => doc.data().todo));
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  // const handleLogin = (event) => {};

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setopenSign(false);
  };

  return (
    <div className="App">
      {user?.displayName ? (
        <Upload username={user.displayName} />
      ) : (
        <h3>sry log in</h3>
      )}

      <div className="app_header">
        <img
          className="app_headerimg"
          src="https://www.alltechbuzz.net/wp-content/uploads/2019/09/57e5dd424854aa14ea898579ce203e7c1d22dfe05558774075277dd2_640.jpg"
          alt=""
        />
        BuddhaGram
      </div>

      {user ? (
        <button type="button" onClick={() => auth.signOut()}>
          logOut
        </button>
      ) : (
        <div className="app_signUp">
          <button type="button" onClick={() => setopenSign(true)}>
            signIn
          </button>
          <button type="button" onClick={() => setOpen(true)}>
            signUp
          </button>
        </div>
      )}

      <form>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_sign">
              <h5>Enter the details</h5>
              <Input
                value={username}
                placeholder="enter username"
                type="text"
                onChange={(event) => setUsername(event.target.value)}
              ></Input>
              <Input
                value={email}
                placeholder="enter email"
                type="text"
                onChange={(event) => setEmail(event.target.value)}
              ></Input>
              <Input
                value={password}
                placeholder="enter password"
                type="text"
                onChange={(event) => setPassword(event.target.value)}
              ></Input>

              <button type="submit" onClick={signUp}>
                Sign up
              </button>
            </form>
          </div>
        </Modal>
      </form>

      <form>
        <Modal open={openSign} onClose={() => setopenSign(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_sign">
              <h5>Enter the details</h5>
              <Input
                value={email}
                placeholder="enter email"
                type="text"
                onChange={(event) => setEmail(event.target.value)}
              ></Input>
              <Input
                value={password}
                placeholder="enter password"
                type="text"
                onChange={(event) => setPassword(event.target.value)}
              ></Input>

              <button type="submit" onClick={signIn}>
                logIn
              </button>
            </form>
          </div>
        </Modal>
      </form>

      {posts.map(({ id, post }) => (
        <Post
          key={id}
          postId = {id}
          user = {user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
