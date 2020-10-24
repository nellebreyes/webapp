const validator = require("validator");
const bycrypt = require("bcryptjs");
const db = require("../server");
const fs = require("fs");

let User = function (data) {
  //console.log(data);
  this.data = data;
  this.errors = [];
};

User.prototype.validate = function () {
  let con = db.dbfunc;
  const usersCollection = con.collection("users");
  return new Promise(async (resolve, reject) => {
    if (this.password == "") {
      this.errors.push(
        "Password must be between 8-30 alphanumeric characters."
      );
    } else if (!validator.isAlphanumeric(this.password)) {
      this.errors.push(
        "Password must NOT contain any special character, only letters and numbers are allowed."
      );
    } else if (
      this.password.length > 0 &&
      (this.password.length < 8 || this.password.length > 30)
    ) {
      this.errors.push(
        "Password must be between 8-30 alphanumeric characters."
      );
    }

    if (this.confirmPassword == "") {
      this.errors.push("Confirm password is required.");
    } else if (this.password !== this.confirmPassword) {
      this.errors.push("Password and confirm password must match.");
    }

    if (this.email == "") {
      this.errors.push("Email is required.");
    } else if (!validator.isEmail(this.email)) {
      this.errors.push("You must enter a valid email.");
    }

    if (this.photo.size == 0 || this.photo.size > 100000) {
      this.errors.push("Photo is required.");
    } else if (
      validator.isMimeType(this.photo.contentType) != "image/jpeg" ||
      validator.isMimeType(this.photo.contentType) != "image/giff" ||
      validator.isMimeType(this.photo.contentType) != "image/jpg" ||
      validator.isMimeType(this.photo.contentType) != "image/webp" ||
      validator.isMimeType(this.photo.contentType) != "image/tiff"
    ) {
      this.errors.push("Photo must be in jpg,png,giff,tiff or webp format");
    }

    //only when the email is valid then check to see if it's taken
    if (validator.isEmail(this.email)) {
      const targetEmail = await usersCollection.findOne({ email: this.email });
      if (targetEmail) {
        this.errors.push("The email entered already exists.");
      }
    }
    resolve();
  });
};

User.prototype.register = async function () {
  return new Promise(async (resolve, reject) => {
    let { fields, files } = this.data;
    let photoObj = files.photo;

    let photo = {
      data: fs.readFileSync(photoObj.path),
      name: photoObj.name,
      contentType: photoObj.type,
      size: photoObj.size,
    };

    //this.username = fields.username.toLowerCase();
    this.email = fields.email.toLowerCase().trim();
    this.password = fields.password;
    this.confirmPassword = fields.confirmPassword;
    this.photo = photo;
    //console.log(photo.name);
    //step 1 validate user data //since we added async function to validate method, we need to make sure that that is
    //completed before we allow other steps to happen
    await this.validate();

    //step 2 connect to db
    if (!this.errors.length) {
      let con = db.dbfunc;
      // console.log(con.databaseName);
      const usersCollection = con.collection("users");

      let salt = bycrypt.genSaltSync(10); //number of salt chars
      this.password = bycrypt.hashSync(fields.password, salt);

      await usersCollection.insertOne({
        username: this.username,
        email: this.email,
        password: this.password,
        photo: this.photo,
      });
      resolve();
      //return console.log("successfully added a new user");
    } else {
      reject(this.errors);
    }
    return this.errors;
  });
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    let con = db.dbfunc;
    const usersCollection = con.collection("users");
    const { email, password } = this.data;
    //console.log(this.data);
    this.email = email.toLowerCase();
    this.password = password;

    //NOTE: do not forget to pass-in the logger parameter
    usersCollection
      .findOne({ email: email })
      .then((logger) => {
        if (logger && bycrypt.compareSync(password, logger.password)) {
          resolve("Thank you for loggin in");
        } else {
          reject("Invalid username or password");
        }
      })
      .catch(function () {
        return "Please try again later.";
      });
  });
};

module.exports = User;
