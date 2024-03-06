const express = require("express"); //require express
const app = express(); // express function
const mongoose = require("mongoose"); // require mongodb use nvm node 18 +version

const Listing = require("./models/listing.js");
const path = require("path");

app.use(express.urlencoded({ extended: true })); //uncode req.body means post request content

app.set("view engine", "ejs"); // set view as express java script
app.set("views", path.join(__dirname, "views")); // benifits of join path the progrma can run from any path the view path in program remains constant

const methodOverride = require("method-override"); // to mangage post,path,delete request

const { read } = require("fs");
app.use(methodOverride("_method")); //it will spacift which name is use to set a method in action tag

const ejsmate = require("ejs-mate"); //ejs mate is to make an boilar plate in program thats include the navigation and

app.engine("ejs", ejsmate);

app.use(express.static(path.join(__dirname, "/public")));

const wrapAsync = require("./utils/wrapAsync.js"); //import wrap async function

const ExpressError = require("./utils/ExpressError.js"); //import Express constructor
const { Console, error } = require("console");

const { listingSchema , reviewSchema} = require("./Schema.js"); // import joi schema this schema will check


// const Review = require("./models/review.js");
const review = require("./models/review.js");













const validatetion = (req, res, next) => {
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

const validateReview=(req,res,next)=>{
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


// Reviews
app.post("/listings/:id/review", validateReview,wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  console.log(listing);
  let newReview = new review(req.body.review);
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review sent");
  // res.send("new review sent");
  res.redirect(`/listings/${listing._id}`)
}));

app.delete("/listings/:id/review/:reviewid",async(req,res)=>
{
let {id,reviewid}=req.params;
let deletedrvo =await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});  //detete review object from the listing 
let deletedrw =await review.findByIdAndDelete(reviewid);
// console.log(deletedrvo,deletedrw);

res.redirect(`/listings/${id}`);

  
})


app.get("/", (req, res) => {
  res.send("runing");
});




//update route
app.put(
  "/listings/:id", // validatetion,                                       //here was passed walidation as middleware it will validate than procide the next process
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let done = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //  console.log(done);
    res.redirect("/listings");
  })
);

//delete routing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
  })
);

///index route
app.get("/listings", async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("./listings/index.ejs", { alllistings });
});


//create route
app.post(
  "/listings",
  validatetion,
  wrapAsync(
    async (
      req,
      res,
      next //here was added const validation thats created adove
    ) => {
      // let {title,description,image,price,country}=req.body;
      let listing = req.body.listing;
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
      await newlisting.save();
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

app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render("./listings/show.ejs", { listing});
  })
);
 
//forword to edit

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
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

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => {
    console.log("db");
  })
  .catch((err) => {
    console.log(err);
  });












// app.all("*", (req, res, next) => {
//   next(new ExpressError(305,"custom err")); // if path is out of servive the user degiend status and message will be passsed into a Expresserror class
// });

// All request will go throw this route if ant errr will occcure this response will send


// app.use((err, req, res, next) => {
//   let { statusCode = 400, message = "not found" } = err; //using == set deafult value to the variable
//   // res.status(statusCode).send(message);               //it will show the error message only and statuscode in console
//   // res.send("something went wrong");                    //new blank page res
//   // res.render("./listings/error.ejs");
//   res.status(504).render("./listings/error");
//   console.log(message);
//   //POST http://localhost:8099/listings 504 (Gateway Timeout)
//   next();
// });

app.listen(8099, () => {
  console.log("server is listing");
});
