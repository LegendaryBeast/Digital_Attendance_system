const CloudinaryConfig = require('../config/cloudinary');

/**
 * ImageService - Single Responsibility: Image upload and management
 * Wraps Cloudinary operations for better abstraction
 */
class ImageService {
    constructor(cloudinaryConfig) {
        this.cloudinaryConfig = cloudinaryConfig || new CloudinaryConfig();
        this.cloudinary = this.cloudinaryConfig.getCloudinary();
    }

    /**
     * Upload image to Cloudinary
     * @param {string} imageData - Base64 encoded image
     * @param {string} folder - Cloudinary folder path
     * @returns {Promise<string>} Image URL
     */
    async uploadImage(imageData, folder = 'attendance') {
        try {
            const result = await this.cloudinary.uploader.upload(imageData, {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto' }
                ]
            });

            return result.secure_url;
        } catch (error) {
            console.error('Image upload error:', error);
            throw new Error('Failed to upload image');
        }
    }

    /**
     * Delete image from Cloudinary
     * @param {string} publicId - Cloudinary public ID
     * @returns {Promise<Object>}
     */
    async deleteImage(publicId) {
        try {
            return await this.cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Image deletion error:', error);
            throw new Error('Failed to delete image');
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     * @param {string} url 
     * @returns {string}
     */
    extractPublicId(url) {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        return filename.split('.')[0];
    }
}

module.exports = ImageService;
