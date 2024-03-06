const express=require("express");
// const router=express.Router();
const router =express.Router({mergeParams:true}); // it will send the id to the next review routes
const mongoose = require("mongoose");
const { listingSchema , reviewSchema} = require("../Schema.js"); // import joi schema this schema will check

const Listing = require("../models/listing.js");
// const Review = require("./models/review.js");
const review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js"); //import wrap async function
//validate review
router.use(express.urlencoded({ extended: true }));

const {isLoggedIn}=require("../middleware.js");
const {validateReview}=require("../middleware.js");
const {isReviewAuthor}=require("../middleware.js");

  
  
  // Reviews
 router.post("/", validateReview,isLoggedIn,wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new review(req.body.review);
    newReview.author= req.user._id;
    listing.review.push(newReview);
  
    await newReview.save();
    await listing.save();
    console.log("new review sent");

    req.flash("sucess","new review added")
    // res.send("new review sent");
    res.redirect(`/listings/${listing._id}`)
  }));

  //delete review
  
 router.delete("/:reviewid",isLoggedIn,isReviewAuthor,async(req,res)=>
  {
  let {id,reviewid}=req.params;
  let deletedrvo =await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});  //detete review object from the listing 
  let deletedrw =await review.findByIdAndDelete(reviewid);
  // console.log(deletedrvo,deletedrw);
  console.log("runing");
  req.flash("sucess","Review Deleted")
  res.redirect(`/listings/${id}`);
  
    
  });
  
  module.exports=router;