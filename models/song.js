const mongoose = require("mongoose");
var SongSchema = mongoose.Schema({
  title: String,
  artist: String,
  uplBy: String,
  collaborators: String,
  year: Number,
  album: String,
  url: String,
  facebook: String,
  twitter: String,
  soundcloud: String,
  youtube: String,
  type: String,
});

module.exports = mongoose.model("Song", SongSchema, "songs");
