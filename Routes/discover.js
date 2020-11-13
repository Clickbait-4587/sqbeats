
const express = require("express");
const router = express.Router();
const Song = require("../models/song");
let songs;
  setInterval(async () => {
    let doc = await Song.find({}, (err, songz) => {
      songs = JSON.stringify(songz);
    });
  }, 1000);
router.post('/', (req,res)=>{
   let searchStr = req.body.search;
   let nSongs = JSON.parse(songs).filter(song => song.artist.toLowerCase().includes(searchStr) || song.title.toLowerCase().includes(searchStr) );
  console.log(nSongs)
  res.setHeader('content-type', 'text/html');

res.render('discover', {
    title: 'Discover | ' + searchStr,
    songs: nSongs,
    str: nSongs.length ? "" : 'No search results found! Try another string...'
})
   // res.send(nSongs)
})

module.exports = router