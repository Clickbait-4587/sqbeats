const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://squashetonics:baseline072@cluster0.bdkny.mongodb.net/clickbeats?retryWrites=true&w=majority";
mongoose.connect("mongodb://localhost:27017/mongo-tree", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

router.get("/", (req, res) => {
  res.send("");
});
router.post("/", (req, res) => {
  res.send(req.body);
});
module.exports = router;
