const express =require("express");
const router=express.Router();

const mongoose = require("mongoose"); // require mongodb use nvm node 18 +version
const wrapAsync = require("../utils/wrapAsync.js"); //import wrap async function

const { listingSchema , reviewSchema} = require("../Schema.js"); // import joi schema this schema will check

const ExpressError = require("../utils/ExpressError.js"); //import Express constructor

const Listing = require("../models/listing.js");

const {isLoggedIn}=require("../middleware.js");

const {isOwner}=require("../middleware.js");

const {validatetion}=require("../middleware.js");








///index route
router.get("/", async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("./listings/index.ejs", { alllistings });
  });
  
//create route
router.post(
  "/",
  validatetion,
  wrapAsync(
    async (
      req,
      res,
      next //here was added const validation thats created adove
    ) => {
      // let {title,description,image,price,country}=req.body;
      // let listing = req.body.listing;
      // console.log(listing);\

      //  if(!newlisting.title|!newlisting.description|!newlisting.image|!newlisting.country|!newlisting.location)
      //  {
      //  throw new ExpressError(544,"invalid all input fiels are required");
      //  }
      //  else
      //  {

      // let result=listingSchema.validate(req.body);
      // console.log("result",result);
      const newlisting = new Listing(req.body.listing);
      newlisting.owner=req.user._id;
      await newlisting.save();
      await newlisting.save();
      req.flash("sucess","new listing created;")
      res.redirect("/listings");
    }
  )
);


//update route


router.put(
  "/:id",isLoggedIn,isOwner, // validatetion,                                       //here was passed walidation as middleware it will validate than procide the next process
  wrapAsync(async (req, res) => {
    let { id } = req.params;      let done = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     console.log(done);
    req.flash("sucess","Listing updated")
    res.redirect(`/listings/`);
    }
    
  )
);

//delete routing
router.delete(
  "/:id",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
     
        let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("sucess","listing deleted");
    res.redirect("/listings");
    }
  
  )
);





// //line 72 or
// if(!req.body.listing)
// {
//     throw new ExpressError(399,"listong not found");d      //it will return th ecustom error that eill display on the page
// }else{
//     //reaming code
// }

router.get(
  "/new",isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"review",populate:"author"}).populate("owner");
    if(!listing)
    {
      req.flash("error","listing not exist");
      res.redirect("/listings");
    }
    else{
      res.render("./listings/show.ejs", { listing});
    }
    
  })
);
 
//forword to edit

router.get( 
  "/:id/edit",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
      req.flash("error","listing not exist");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);



// app.get("/test",async (req,res)=>{
//     let samplelisting=new Listing({
//         title:"my test",
//         description:"test desc0",
//         price:3200,
//         location:"test goa",
//         country:"india"
//     });
//     await samplelisting.save().then((res)=>

// {
// console.log(res);
// }).catch((er)=>{
//     console.log(er);
// });
// console.log("sample was sasved");
// res.send("sucess");

// })

module.exports = router;