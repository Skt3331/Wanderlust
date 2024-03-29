const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //import wrap async function
const { isOwner, isLoggedIn, validatetion } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer=require('multer');

const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router.route("/")
  ///index route
  .get(wrapAsync(listingController.index))
  //create route

  .post(isLoggedIn,//validatetion,
    upload.single("listing[image]"),wrapAsync(listingController.create)
  );


//update route
router.get(
  "/new", isLoggedIn,
  wrapAsync(listingController.newlisting)
);

router.route("/:id")

  .put(isLoggedIn, isOwner,  upload.single("listing[image]"),                               //here was passed walidation as middleware it will validate than procide the next process
    wrapAsync(listingController.update
    )
  )
  //delete routing
  .delete(
    isLoggedIn, isOwner,
    wrapAsync(listingController.delete

    )
  )

  //show route
  .get(
    wrapAsync(listingController.showroute)
  );



//forword to edit

router.get(
  "/:id/edit", isLoggedIn, isOwner,
  wrapAsync(listingController.editlisting)
);

module.exports = router;