
if(process.env.NODE_ENV !="production")
{
  require("dotenv").config();
}






const express = require("express"); //require express
const app = express(); // express function
const mongoose = require("mongoose"); // require mongodb use nvm node 18 +version

const Listing = require("./models/listing.js");
const path = require("path");

///for processing on image
// const multer=require('multer');
// const upload=multer({dest:'uploads/'});  //create upload folder and upload//

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


//passport 
const passport=require("passport");

const LocalStrategy = require("passport-local");

const User =require("./models/user.js");

const validation=require("./middleware.js");





//flash
const flash=require("connect-flash");
app.use(flash());

//reqire session
const session=require("express-session");

// set session parameters
app.use(session({
  secret:"mycode",
  resave:false,
  saveUninitialized:true ,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,  //this cookie will expire automatically and Date.now() return value in milisecounds
    maxage:7*24*60*60*1000,
    httpOnly:true,
  }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//user information in session
passport.deserializeUser(User.deserializeUser());//remove info from session


// app.get("/",(req,res)=>
// {
//   res.send("ruuning");
// });

// app.get("/demouser",async(req,res)=>
// {
//   let fakeuser=new User(
//     {
//       email:"fake@gmail.com",
//       username:"fake"
//     }
//   );
//  let regnew= await User.register(fakeuser,"pass@123");
//  res.send(regnew);

// // {"email":"fake@gmail.com","_id":"65e43a10143936256553f1e0","username":"fake","salt":"3fc791492dead91babab07b9f392f7f203f31ba6ecd126c72f2bfa0175cce57e","hash":"8fd733501833474e0b2ad41bb15e833ad859d42bb6b630ebcb9791798b8f6aaff813475b5d7c3cd39388cccd3d4cab3d4c3ead0d77935f1541a799e3fa1d99a96c98ace6f3b4d1437623cf86a95de0256667b50818239960f1c2058228ad029a6f8d442e0e51f660b1baa10b72c10c7b928f8b445fd3783604f4078bec4783a9071d0cff47869bbe1efa8860ae33988cec3f6090a22cd505fe39ae723eba319df6bd023535267234ac4d29c1fddf7a2ec7a891720f155aab373e368ccffa792cfad5254bc9809bdf5213babf8f3ee8d3d862354eceb510ce865988d086cf028a37471550a40bed65f67895683d2d67b70f33d672d043b6a5673ba64d186a11732219548ff3490e9d211fb99892e248b18b1b6559441c143dfb8b8a5bd7ae78084a0b8788bc3e939b4784a8f91f32c9765fc482897645e2fe6025dd093d33030da7b7e23dd323d919891466b5f5e34a6a013241d934cee36419f925097662ca7e09453579ba59d49145accaad4f03eca16add88ea73aebcfb24ac9a74cbeef061352d627c4c72ff3836824475e385458572cc58cf41bfe498721beab972b5e404c3cc9b4e41c617fb85d03f6a8f3cd31e3bbdd6686079d07be739b8d8b3316de355ddc4c5c933fffdbd772245d96fb8b7d4eb7632541cbca616822123bbc617993ef8ed542da633ecdfccdc3d84543ff7750fc1db3cd0b2ba73d8323bb0767c0a","__v":0}
// });





// const Review = require("./models/review.js");
const review = require("./models/review.js");

//Express route                                                                       

const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


// /this was created to flash the message and stoe inti locals
app.use((req,res,next)=>
{
  res.locals.sucess=req.flash("sucess");
  res.locals.error=req.flash("error");
  res.locals.curUser=req.user;
  next();
});


app.use("/listings",listingRouter);

// parent route 
app.use("/listings/:id/review",reviewsRouter);
// this id parameter not be sent ro review/

app.use("/",userRouter);















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


app.use((err, req, res, next) => {
  let { statusCode = 400, message = "not found" } = err; //using == set deafult value to the variable
  // res.status(statusCode).send(message);               //it will show the error message only and statuscode in console
  // res.send("something went wrong");                    //new blank page res
  // res.render("./listings/error.ejs");
  res.status(504).render("./listings/error");
  console.log(message);
  //POST http://localhost:8099/listings 504 (Gateway Timeout)
  next();
});

app.listen(8099, () => {
  console.log("server is listing");
});
