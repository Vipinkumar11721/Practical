
const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
  .populate("owner");
  if(!listing){
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    if (req.user) newListing.owner = req.user._id;

    // If a file was uploaded, attach its Cloudinary info; otherwise leave image undefined
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      newListing.image = { url, filename };
    }

    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    return res.redirect("/listings");
  } catch (err) {
    console.error('Error creating listing:', err);
    return next(err);
  }
};


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("Listing you requested for does not exist!");
    res.redirect("/listings");
  };
  res.render("listings/edit.ejs", { listing });
};


module.exports.updateListing = async (req, res) => {
     let { id } = req.params;
     let updateData = { ...req.body.listing };
     if (req.file) {
       updateData.image = {
         url: req.file.path,
         filename: req.file.filename
       };
     }
     try {
       await Listing.findByIdAndUpdate(id, updateData);
       req.flash("success", "Successfully updated the listing!");
       return res.redirect("/listings");
     } catch (err) {
       console.error('Error updating listing:', err);
       return res.redirect('/listings');
     }
};



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing!");
  console.log(deletedListing);
  res.redirect("/listings");
};

