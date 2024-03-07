const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //import wrap async function
const { isOwner, isLoggedIn, validatetion } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer=require('multer');
const upload=multer({dest:'uploads/'});


router.route("/")
  ///index route
  .get(listingController.index)
  //create route
  .post(upload.single('listing[image]'),(req,res)=>
  {
    res.send(req.file);
  });
  // .post(validatetion, wrapAsync(listingController.create)
  // );


//update route
router.get(
  "/new", isLoggedIn,
  wrapAsync(listingController.newlisting)
);

router.route("/:id")

  .put(isLoggedIn, isOwner,                                 //here was passed walidation as middleware it will validate than procide the next process
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