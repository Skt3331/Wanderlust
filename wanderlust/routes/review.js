const express = require("express");

const router = express.Router({ mergeParams: true }); // it will send the id to the next review routes

const wrapAsync = require("../utils/wrapAsync.js"); //import wrap async function

router.use(express.urlencoded({ extended: true }));

const { isLoggedIn } = require("../middleware.js");
const { validateReview } = require("../middleware.js");
const { isReviewAuthor } = require("../middleware.js");

const reviewcontroller = require("../controller/review.js");


// Reviews
router.post("/", //validateReview, 
isLoggedIn, wrapAsync(reviewcontroller.postreview));

//delete review

router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync(reviewcontroller.distroy));

module.exports = router;