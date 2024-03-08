const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("./listings/index.ejs", { alllistings });
};

module.exports.create = async (
  req,
  res,
) => {
  let url=req.file.path;
  let filename=req.file.filename;
  // console.log(url,filename);
  const newlisting = new Listing(req.body.listing);
  newlisting.image={url,filename};
  newlisting.owner = req.user._id;
  await newlisting.save();
  await newlisting.save();
  req.flash("sucess", "new listing created;")
  res.redirect("/listings");
}


module.exports.update = async (req, res) => {
  if(req.file)
  {
      let url=req.file.path;
  let filename=req.file.filename;
  req.body.listing.image={filename,url};
  }

  let { id } = req.params;
   let done = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  console.log(done);
  req.flash("sucess", "Listing updated")
  res.redirect(`/listings/`);
}
  ;



module.exports.delete = async (req, res) => {
  let { id } = req.params;

  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("sucess", "listing deleted");
  res.redirect("/listings");
};


module.exports.newlisting = async (req, res) => {
  res.render("listings/new.ejs");
};


module.exports.showroute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "review", populate: "author" }).populate("owner");
  if (!listing) {
    req.flash("error", "listing not exist");
    res.redirect("/listings");
  }
  else {
    res.render("./listings/show.ejs", { listing });
  }

};


module.exports.editlisting=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing)
  {
    req.flash("error","listing not exist");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing });
};
