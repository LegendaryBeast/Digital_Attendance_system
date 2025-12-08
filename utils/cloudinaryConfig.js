const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} imageData - Base64 encoded image data or file path
 * @param {string} folder - Folder name in Cloudinary (default: 'attendance')
 * @returns {Promise<string>} - Cloudinary image URL
 */
async function uploadImage(imageData, folder = 'attendance') {
    try {
        const result = await cloudinary.uploader.upload(imageData, {
            folder: folder,
            resource_type: 'image',
            transformation: [
                { width: 800, height: 800, crop: 'limit' }, // Limit max dimensions
                { quality: 'auto' } // Auto-optimize quality
            ]
        });

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the image
 * @returns {Promise<void>}
 */
async function deleteImage(publicId) {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
}

module.exports = {
    uploadImage,
    deleteImage,
    cloudinary
};
