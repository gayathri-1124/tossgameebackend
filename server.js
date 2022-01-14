const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("tiny"));

app.use(cors());

let session = [];

app.get("/", (req, res) => {
  res.send("server do be online");
});

app.post("/registersession", (req, res) => {
  let sessionID = req.body.sessionID;
  let username = req.body.username;
  let isNewSession =
    session.find((x) => x.sessionID === sessionID) === undefined ? true : false;
  if (isNewSession) {
    session.push({
      sessionID: sessionID,
      admin: username,
      participants: [username],
      status: 0,
      roomLocked: false,

      result: -1,
    });
    console.log("made new session");
    console.log(session);
  } else {
    let sess = session.find((x) => x.sessionID === sessionID);
    if (sess.roomLocked) {
      res.send({ message: "locked" });
      return;
    }
    if (sess.participants.indexOf(username) === -1) {
      sess.participants.push(username);
      console.log("added to session");
      console.log(session);
    } else {
      console.log("reentry");
    }
  }
  let sess = session.find((x) => x.sessionID === sessionID);
  res.send(sess);
});

app.post("/getdata", (req, res) => {
  let sessionID = req.body.sessionID;
  let sess = session.find((x) => x.sessionID === sessionID);
  res.send(sess);
});
app.post("/lockroom", (req, res) => {
  let sessionID = req.body.sessionID;
  let sess = session.find((x) => x.sessionID === sessionID);
  sess.roomLocked = true;
  sess.status = 1;

  res.send({ message: "locked" });
});

app.post("/tosscoin", (req, res) => {
  let sessionID = req.body.sessionID;
  let sess = session.find((x) => x.sessionID === sessionID);
  let array = [3, 4];
  const tossresult = array[Math.floor(Math.random() * array.length)];
  console.log(sess);
  sess.result = tossresult;

  console.log(session);
  res.send({ result: tossresult });
});

app.listen(3000, () => {
  console.log("listening");
});
