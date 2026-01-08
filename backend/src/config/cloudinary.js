const cloudinary = require('cloudinary').v2;
const Environment = require('./environment');

class CloudinaryConfig {
    constructor() {
        this.configure();
    }

    configure() {
        cloudinary.config({
            cloud_name: Environment.CLOUDINARY_CLOUD_NAME,
            api_key: Environment.CLOUDINARY_API_KEY,
            api_secret: Environment.CLOUDINARY_API_SECRET
        });
    }

    getCloudinary() {
        return cloudinary;
    }
}

module.exports = CloudinaryConfig;
