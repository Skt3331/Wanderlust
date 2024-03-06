const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //import wrap async function
const {isOwner,isLoggedIn,validatetion} = require("../middleware.js");
const listingController = require("../controller/listings.js");




///index route
router.get("/", listingController.index);

//create route
router.post(
  "/",
  validatetion,
  wrapAsync(listingController.create)
);


//update route


router.put(
  "/:id", isLoggedIn, isOwner, // validatetion,                                       //here was passed walidation as middleware it will validate than procide the next process
  wrapAsync(listingController.update
  )
);

//delete routing
router.delete(
  "/:id", isLoggedIn, isOwner,
  wrapAsync(listingController.delete

  )
);

router.get(
  "/new", isLoggedIn,
  wrapAsync(listingController.newlisting)
);

//show route
router.get(
  "/:id",
  wrapAsync(listingController.showroute)
);

//forword to edit

router.get(
  "/:id/edit", isLoggedIn, isOwner,
  wrapAsync(listingController.editlisting)
);

module.exports = router;