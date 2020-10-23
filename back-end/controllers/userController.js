const User = require("../models/User");

exports.home = (req, res) => {
  res.send("This is the home page");
};

exports.register = (req, res) => {
  let user = new User(req.body);
  const result = user.register();
  res.send(result);
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
