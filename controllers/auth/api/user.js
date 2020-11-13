const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const handlebars = require("handlebars");
const passport = require("passport");
exports.rr = "";
exports.signup = (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err.message);
        return next(err);
      }
      passport.authenticate("local")(req, res, function () {
        res.send(req.body);
      });
    }
  );
};
