const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, saveRedirectUrl } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Safe upload wrapper: run multer and catch errors so they don't crash the request
function safeUpload(fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        // attach the error to the request for controller/logging to handle gracefully
        console.error('Upload middleware error:', err);
        req.fileUploadError = err;
        return next();
      }
      next();
    });
  };
}

// Normalize bracket-style form fields (e.g. listing[title]) into a nested object
function normalizeListingBody(req, res, next) {
  try {
    if (req.body && !req.body.listing) {
      const listing = {};
      for (const key of Object.keys(req.body)) {
        const m = key.match(/^listing\[(.+)\]$/);
        if (m) {
          listing[m[1]] = req.body[key];
        }
      }
      if (Object.keys(listing).length) {
        req.body.listing = listing;
      }
    }
  } catch (e) {
    console.error('Error normalizing listing body:', e);
  }
  next();
}

router
  .route("/")
    .get(wrapAsync(listingsController.index))
    .post(isLoggedIn, safeUpload("listing[image]"), normalizeListingBody, validateListing, wrapAsync(listingsController.createListing));



router.get("/new", saveRedirectUrl, isLoggedIn, listingsController.renderNewForm);


router 
  .route("/:id")
    .get( wrapAsync(listingsController.showListing))
    .put(isLoggedIn, isOwner, safeUpload("listing[image]"), normalizeListingBody, validateListing, wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing));   




router.get("/:id/edit", saveRedirectUrl, isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm));


module.exports = router;