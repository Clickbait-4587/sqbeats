const express = require("express");
const router = express.Router(),
  multer = require("multer");
const fs = require("fs");
const request = require("request");
const path = require("path");
const Song = require("../../models/song");
const User = require("../../models/user");

var storage = multer.diskStorage({
  destination: path.join(__dirname, "songs/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

//Open db

const mongoURI =
  "mongodb+srv://squashetonics:TPWbUdSRFfNVmnQM@cluster0.bdkny.mongodb.net/clickbeats?retryWrites=true&w=majority";
var mongoose = require("mongoose");

// make a connection
mongoose.connect(mongoURI);

// get reference to database
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connection Successful!");

  router.post("/", upload.single("track"), function (req, res, next) {
    const API_URL = "https://morejust.herokuapp.com/file";

    var r = request.post(API_URL, function optionalCallback(
      err,
      httpResp,
      fileLink
    ) {
      if (err) {
        return console.error("Upload failed:", err);
      }
      let data = req.user.username
        ? {
            title: req.body.title,
            uplBy: req.user.username,
            artist: req.body.artist,
            collaborators: typeof req.body.collaborators == 'string' ? req.body.collaborators: 'No Collaborators.',
            year: parseInt(req.body.year),
            album: req.body.album,
            url: fileLink,
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            soundcloud: req.body.soundcloud,
            youtube: req.body.youtube,
            type: req.body.type,
          } 
        : {};

      //-----------------------------

      let rawdata = fs.readFile(path.resolve(__dirname, "songs.json"), (err) =>
        err ? console.log(err) : ""
      );

      var song1 = new Song(data);
      // save model to database || songs collection
      song1.save(function (err, song) {
        if (err) return console.error(err);
        console.log(song.title + " saved to songs collection.");
        res.redirect("/upload");
      });
      // Save to users collection
      async function ret() {
        const doc = await User.findOne({ username: req.user.username });
        doc.songs = [...doc.songs, data];
        await doc.save();
      }
      ret();
      //-------------------------

      console.log("Upload successful! Link:", fileLink);
    });
    var form = r.form();

    // To load file from current folder
    async function upl() {
      return form.append(
        "file",
        fs.createReadStream(path.join(__dirname, "songs/" + req.file.filename))
      );
    }
    upl().then(() => {
      try {
        fs.unlink(path.join(__dirname, "songs/" + req.file.filename), (err) => {
          if (err) {
            console.log(err.message);
          }
        });
      } catch (err) {
        console.log(err.message);
      }
    });
  });
});
module.exports = router;
