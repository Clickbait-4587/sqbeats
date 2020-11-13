const { config } = require("process");
const port = process.env.PORT || 3000,
path = require("path"),
fs = require("fs"), { config } = require("process")
//Set up database connection
,express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("./models/user"),
  LocalStrategy = require("passport-local"),
  app = express(),
  morgan = require("morgan"),
passportLocalMongoose = require("passport-local-mongoose"), mongoURI =
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
      var dbAdmin = db.db.admin();
    }
  });
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(morgan("dev"));
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
  app.set("view engine", "handlebars" );
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
  app.use('/discover', require('./Routes/discover'))
  app.post("/login", passport.authenticate("local"), function (req, res) {
    res.redirect("/");
  });
  // Path to static files
  app.use(express.static(path.join(__dirname, "/public")));


  const Song = require("./models/song");
  setInterval(async () => {
    let doc = await Song.find({}, (err, songz) => {
      songs = JSON.stringify(songz);
    });
  }, 1000);

  app.get("/", (req, res) => {
   
let user = req.user? JSON.stringify(req.user) : ''
    res.render("index", {
      heading: "Clickbeats",
      title: 'Clickbeats',
      user: req.user?  JSON.parse(user) :'',
      songs: JSON.parse(songs),
      init: req.user? req.user.username[0] : '',
    });
  });

  var files = fs.readdirSync("./views");
  files.forEach((file) => {
    file = file.split(".")[0];
    app.get("/" + file, (req, res) => {
      let user = req.user ? JSON.stringify(req.user) : ''
      res.setHeader('content-type', 'text/html');
      res.render(file, {
        heading: "Clickbeats",
        title: 'Clickbeats | ' + file,
        songs: JSON.parse(songs),
        user:req.user? JSON.parse(user) : '',
        init: req.user? req.user.username[0] : '',
      });
    });
  });
  //logout
  app.get("/logout", function (req, res) {
    let ref = req.headers.referer.split('/')
    ref = ref[ref.length - 1] ? `/${ref[ref.length - 1]}`: '/';
    req.logout();
    res.redirect(ref);
  });
  // get all app users
  app.get("/users", (req, res) => {
    User.find({}, (err, users) => {
      let userL = {};
      users.forEach((user) => {
        userL[user._id] = user;
      });
      res.send(userL);
    });
  });

  app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    res.render('404')
  });

  app.use((error, req, res, next) => {
    console.log(error);
    
  });

// Connect app
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});

