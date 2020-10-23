const express = require("express");
const router = express.Router();

//controllers
const userController = require("../controllers/userController");

//user related routes
router.get("/", userController.home);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/register", userController.register);

module.exports = router;
