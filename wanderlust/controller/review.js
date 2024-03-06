const Listing=require("../models/listing");
const review=require("../models/review.js");


module.exports.postreview=async (req, res) => {
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
  };

  module.exports.distroy=async(req,res)=>
  {
  let {id,reviewid}=req.params;
  let deletedrvo =await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});  //detete review object from the listing 
  let deletedrw =await review.findByIdAndDelete(reviewid);
  // console.log(deletedrvo,deletedrw);
  console.log("runing");
  req.flash("sucess","Review Deleted")
  res.redirect(`/listings/${id}`);
  
    
  }
;


