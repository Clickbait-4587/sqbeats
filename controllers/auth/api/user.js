const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const handlebars = require("handlebars");
const passport = require("passport");
exports.signup = (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err.message);
        return next(err);
      }
      //console.log(user);
      passport.authenticate("local")(req, res, function () {
        res.writeHead(302, {
          Location: "/",
        });
        res.end();
      });
    }
  );
  //res.redirect("/");
};
