const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");

// Route for login
router.route("/login")
    .get((req, res) => {
        res.render("./users/login.ejs");
    })
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), wrapAsync(usercontroller.login));

// Route for logout
router.get("/logout", isLoggedIn, usercontroller.logout);

// Route for signup
router.route("/signup")
    .get((req, res) => {
        res.render("./users/signup.ejs");
    })
    .post(wrapAsync(usercontroller.signup));

module.exports = router;
