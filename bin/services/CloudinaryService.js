const cloudinary = require("cloudinary").v2;
const {
  cloud_name,
  api_key,
  api_secret,
} = require("../../config.json").cloudinary;

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });
  }

  save(base64) {
    return cloudinary.uploader.upload(base64);
  }
}

module.exports = new CloudinaryService();
