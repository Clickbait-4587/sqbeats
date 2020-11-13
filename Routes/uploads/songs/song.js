
  // define Schema
  var SongSchema = mongoose.Schema({
    title: String,
    artist: String,
    collaborators: String,
    year: Number,
    album: String,
    url: String,
  });

  // compile schema to model
  var Song = mongoose.model("Song", SongSchema, "songs");
  // a document instance
  let rawdata = fs.readFileSync(path.resolve(__dirname, "songs.json"));
  let song = JSON.parse(rawdata);

  var song1 = new Song(song);
  // save model to database
  song1.save(function (err, song) {
    if (err) return console.error(err);
    console.log(song.title + " saved to songs collection.");
  });