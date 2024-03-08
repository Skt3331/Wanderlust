const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require("dotenv").config();

cloudinary.config({
    cloud_name:process.env.Cloud_Name,
    api_key:process.env.Cloud_Api_Key,
    api_secret:process.env.Cloud_Api_Secret

})

 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdformats: ["png","jpg","jpeg"],
    },
  });

module.exports={cloudinary,storage};