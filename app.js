const port = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const { config } = require("process");
//Set up database connection
const bodyParser = require("body-parser");
const express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  app = express(),
  morgan = require("morgan");
passportLocalMongoose = require("passport-local-mongoose");

const mongoURI =
  "mongodb+srv://squashetonics:TPWbUdSRFfNVmnQM@cluster0.bdkny.mongodb.net/clickbeats?retryWrites=true&w=majority";
try {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (err) {
  console.log(err.message);
}
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  {
    console.log("Connected successfully");
    var dbAdmin = db.db.admin();

    //dbAdmin.addUser("user1", "user1pass", (err, res) => {
    //  if (err) {
    //    throw err.message;
    //  }
    //  console.log(res);
    //});
  }
});
app.use(passport.initialize());
app.use(passport.session());

//
app.use(morgan("dev"));
//
app.use(
  require("express-session")({
    secret: "Hello World, this is a session",
    resave: false,
    saveUninitialized: false,
  })
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Template engine
const exphbs = require("express-handlebars");

// init the engie
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
// Set a parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Init routes
app.use("/uploads/upload", require("./Routes/uploads/upload"));
app.use("/signup", require("./Routes/user"));

app.post("/login", passport.authenticate("local"), function (req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect("/");
});

// Path to static files
app.use(express.static(path.join(__dirname, "/public")));
let rr = require("./controllers/auth/api/user").rr;
// Gets
console.log(rr);
app.get("/", (req, res) => {
  res.render("index", {
    heading: "Clickbeats",
    error: rr,
    user: req.user,
  });
});
var files = fs.readdirSync("./views");
files.forEach((file) => {
  file = file.split(".")[0];
  app.get("/" + file, (req, res) => {
    res.render(file, {
      heading: "Clickbeats",
      title: file,
      error: "init err",
      user: req.user,
    });
  });
});
//logout
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
// get all app users
app.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    let userL = {};
    users.forEach((user) => {
      userL[user._id] = user;
    });
  });
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

// Connect app
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
