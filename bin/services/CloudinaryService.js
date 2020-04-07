const cloudinary = require('cloudinary').v2;


module.exports = function () {
    cloudinary.config({ 
        cloud_name: 'dzcljuelk', 
        api_key: '271565619181855', 
        api_secret: 'HeUSRI-WoEDKuulck4d7KfV4tno' 
      });

    this.save = function(base64) {
        return cloudinary.uploader.upload(base64)
    }
}

