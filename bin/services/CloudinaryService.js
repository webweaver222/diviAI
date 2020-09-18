const cloudinary = require("cloudinary").v2;
const {
  cloud_name,
  api_key,
  api_secret
} = require("../../config.json").cloudinary;

module.exports = function() {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret
  });

  this.save = function(base64) {
    return cloudinary.uploader.upload(base64);
  };
};
