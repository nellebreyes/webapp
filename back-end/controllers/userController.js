const User = require("../models/User");
const formidable = require("formidable");

exports.home = (req, res) => {
  if (req.session.user) {
    res.send("This page will show the user profile later");
  } else {
    res.redirect("/");
  }
};

exports.register = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be uploaded" });
    }

    let user = new User({ fields, files });
    user
      .register()
      .then(function () {
        console.log("nice image");
        return res.send("Nice pic!");
      })
      .catch(function (err) {
        return res.send(err);
      });
  });
};

exports.login = (req, res) => {
  let user = new User(req.body);

  user
    .login()
    .then(function (result) {
      req.session.user = { email: user.email };

      //since updating the session data in the db is an asynchronous event and will take some time
      //we should pass a callback to make the timing of redirection happen after the session data
      //is saved in the db

      req.session.save(function () {
        console.log(result);
        res.redirect("/api");
      });
    })
    .catch(function (err) {
      console.log(result);
      res.redirect("/api");
    });
};

exports.mustBeLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.send("You must be logged in to schedule appointments.");
  }
};

exports.logout = (req, res) => {
  //let us redirect the user to the home page instead of sending logout msg
  //callback function is used to make sure that destroy is completed before redirection is done
  //since there is no promise functionality for session as of yet, we are using callback fn
  req.session.destroy(function () {
    console.log("logging out...");
    res.redirect("/api/");
  });

  //res.send("You are now logged out.");
};
