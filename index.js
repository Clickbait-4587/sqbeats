const firebase = require("firebase");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
let users = [];
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
var firebaseConfig = {
  apiKey: "AIzaSyBX4tfQZNUHnRKopID4RrQ-akdzysggV90",
  authDomain: "sketchi-4587.firebaseapp.com",
  databaseURL: "https://sketchi-4587.firebaseio.com",
  projectId: "sketchi-4587",
  storageBucket: "sketchi-4587.appspot.com",
  messagingSenderId: "728507359355",
  appId: "1:728507359355:web:5d2aa890d7f375176f02de",
  measurementId: "G-8EXGEF7MBT",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const store = firebase.firestore();

let paths = ["upload", "mytracs", "cart", "discover"];

try {
  store
    .collection("Users")
    .get()
    .then((snap) => {
      snap.docs.forEach((doc) => {
        if (Object.keys(doc.data()) == "username") {
          users.push(Object.values(doc.data())[0]);
        }
      });
    })
    .then(() => {
      
      paths.push({ users: Object.values(users) });
      app.listen(port, () => console.log("Running on port " + port));
    })
    .then(() => {
      console.log(paths)
      paths.forEach((path) => {
        if (Object.keys(path) == "users") {
          Object.values(path).forEach((value) => {
            value.forEach((val) => {
              app.get("/" + val, (req, res) => {
                res.sendFile(__dirname + "/public/profile.html");
                //res.send("jjjj");
              });
            });
          });
        } else {
          app.get("/" + path, (req, res) => {
            res.sendFile(__dirname + "/public/" + path + ".html");
          });
        }
      });
    });
} catch (err) {
  console.log(err.message);
}
