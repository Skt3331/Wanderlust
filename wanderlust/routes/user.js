const express=require("express");
const router=express.Router();


const User =require("../models/user.js"); 
const wrapAsync = require("../utils/wrapAsync");
// router.use(express.urlencoded({ extended: true }));

const passport=require("passport");

const {isLoggedIn,saveRedirectUrl}=require("../middleware.js");

const usercontroller=require("../controller/user.js");


router.get("/login",(req,res)=>
{
    res.render("./users/login.ejs");
});



router.post("/login",saveRedirectUrl,passport.authenticate
("local",{failureRedirect:"/login",failureFlash:true})
,wrapAsync(usercontroller.login ));


router.get("/logout",isLoggedIn,usercontroller.logout);












router.get("/signup",(req,res)=>
{
    res.render("./users/signup.ejs");
});
router.post("/signup",wrapAsync(usercontroller.signup));

module.exports=router;