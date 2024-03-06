const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");

const User =require("../models/user.js"); 
const wrapAsync = require("../utils/wrapAsync");
// router.use(express.urlencoded({ extended: true }));

const passport=require("passport");
const { nextTick } = require("process");

const {isLoggedIn,saveRedirectUrl}=require("../middleware.js");

router.get("/login",(req,res)=>
{
    res.render("./users/login.ejs");
});



router.post("/login",saveRedirectUrl,passport.authenticate
("local",{failureRedirect:"/login",failureFlash:true})
,wrapAsync(async(req,res)=>
{
   req.flash("sucess","welcome to wanderlust");
  
   res.redirect(res.locals.redirectUrl||"/listings")  //if res.locals.redirect is undefiend it will directly redirect to / listings
   }

 ));


router.get("/logout",isLoggedIn,(req,res)=>
{
    req.logOut((err)=>
    {
        if(err)
        {
            return next(err);
        }
       req.flash("sucess","logged out sucess");
       res.redirect("/listings");
    })
});










router.get("/signup",(req,res)=>
{
    res.render("./users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>
{
    try
    {

    
    let{username,email,password}=req.body;
  
    let nuser=new User(
        {
          email:email,
          username:username
        }
      );
     let regnew= await User.register(nuser,password);
     req.login(regnew,(err)=>
     {
        if(err)
        {
            return next(err);
        }
    req.flash("sucess","user signup sucess");
    res.redirect("/listings");
         })
     
    }
    catch(e)
    {
   req.flash("error",e.message);
   res.redirect("/signup");
    }
}));

module.exports=router;