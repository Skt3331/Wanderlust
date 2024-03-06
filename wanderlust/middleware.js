 const Listing=require("./models/listing")
 const ExpressError = require("./utils/ExpressError.js");
 const { listingSchema , reviewSchema} = require("./Schema.js"); 
 const review = require("./models/review.js");

 module.exports.isLoggedIn=(req,res,next)=>
 {
   // console.log(req.user);
    if(!req.isAuthenticated())
    {
      //redict url
      req.session.redirectUrl=req.originalUrl;
// console.log("gfjhghkg",req.originalUrl);

    req.flash("error","you must login ");
    return res.redirect("/login");
 }
 next();
};

module.exports.saveRedirectUrl=(req,res,next)=>
{
if(req.session.redirectUrl){
   res.locals.redirectUrl=req.session.redirectUrl;
   // console.log(res.locals.redirectUrl);
}
next();
}

module.exports.isOwner=async(req,res,next)=>
{
   let {id}=req.params;
   let list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.curUser._id))
    {
      req.flash("error","You dont have to permission");
      res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>
{
   let {id,reviewid}=req.params;
   let revie = await review.findById(reviewid);
  //  console.log(revie);
    if(!revie.author.equals(res.locals.curUser._id))
    {
      req.flash("error","you not author");
      res.redirect(`/listings/${id}`)
      // res.send("non");
    }
    else
    {
       next();
    }
  
    };
   




module.exports.validatetion = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
  
    if (error) {
      //here can created an middleware for checking validation
      let errMsg = error.details.map((el) => el.message).join(",");
  
      throw ExpressError(344, errMsg);
    } else {
      next();
    }
  };

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error)
    {
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(333,"joi review validation");
    }
    else{
      next();
    }
  
  }