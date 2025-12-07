const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, saveRedirectUrl } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
    .get(wrapAsync(listingsController.index))
    .post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingsController.createListing));



router.get("/new", saveRedirectUrl, isLoggedIn, listingsController.renderNewForm);


router 
  .route("/:id")
    .get( wrapAsync(listingsController.showListing))
    .put(isLoggedIn, isOwner, validateListing, upload.single("listing[image]"), wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing));   




router.get("/:id/edit", saveRedirectUrl, isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm));


module.exports = router;