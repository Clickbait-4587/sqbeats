const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

// Template engine
const exphbs = require("express-handlebars");
// init the engie
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
// Set a parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Init routes
app.use("/uploads/upload", require("./Routes/uploads/upload"));

// Path to static files
app.use(express.static(path.join(__dirname, "/public")));
// Gets
app.get("/", (req, res) => {
  res.render("index");
});
var files = fs.readdirSync("./views");
files.forEach((file) => {
  file = file.split(".")[0];
  app.get("/" + file, (req, res) => {
    res.render(file, {
      heading: "Clickbeats",
      title: file,
    });
  });
});

// AUTH with bcrypt

// Connect app
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
