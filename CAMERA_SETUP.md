# Camera-Based Attendance Authentication - Setup Guide

## Overview
This guide will help you set up the camera-based authentication system for offline class attendance. When students mark attendance for offline classes, they will be required to take a selfie, which will be uploaded to Cloudinary and stored with their attendance record.

## Prerequisites
1. A Cloudinary account (free tier is sufficient)
2. Node.js and npm installed
3. MongoDB running
4. Existing Digital Attendance System setup

## Step 1: Create a Cloudinary Account

1. **Sign up for Cloudinary**:
   - Go to [https://cloudinary.com/](https://cloudinary.com/)
   - Click "Sign Up" and create a free account
   - Verify your email address

2. **Get your API credentials**:
   - After logging in, you'll be taken to the Dashboard
   - You'll see your **Cloud Name**, **API Key**, and **API Secret**
   - Keep these credentials handy for the next step

## Step 2: Configure Environment Variables

1. **Update your `.env` file**:
   
   Add the following lines to your `.env` file (create it if it doesn't exist):
   
   ```env
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   CLOUDINARY_API_KEY=your-api-key-here
   CLOUDINARY_API_SECRET=your-api-secret-here
   ```

2. **Replace the placeholder values**:
   - `your-cloud-name-here` → Your Cloudinary Cloud Name
   - `your-api-key-here` → Your Cloudinary API Key
   - `your-api-secret-here` → Your Cloudinary API Secret

## Step 3: Install Dependencies

The required packages (`cloudinary` and `multer`) have already been installed. If you need to reinstall:

```bash
npm install cloudinary multer
```

## Step 4: Restart Your Server

After configuring the environment variables, restart your server:

```bash
npm run dev
```

Or for production:

```bash
npm start
```

## How It Works

### For Students (Offline Classes Only)

1. **Open Attendance Modal**: Click on an offline class to mark attendance
2. **Location Verification**: The system will automatically get your location
3. **Camera Access**: 
   - Click "Start Camera" to enable your camera
   - Allow browser camera permissions when prompted
4. **Take Photo**:
   - Position yourself in the camera frame
   - Click "Capture Photo" to take a selfie
   - If not satisfied, click "Retake Photo" to try again
5. **Submit Attendance**:
   - Enter the validation code from your teacher
   - Click "Submit Attendance"
   - Your photo will be uploaded to Cloudinary and linked to your attendance record

### For Teachers

When viewing attendance records, teachers can:
- See all students who attended
- Access the photo verification images stored in Cloudinary
- Verify student identity by comparing photos
- Detect if someone gave their ID to another person

### Database Schema

The attendance record now includes:
```javascript
{
  class: ObjectId,
  student: ObjectId,
  studentName: String,
  registrationNumber: String,
  studentLocation: { latitude: Number, longitude: Number },
  validationCodeUsed: String,
  distance: Number,
  imageUrl: String,  // NEW: Cloudinary URL of the student's photo
  timestamp: Date
}
```

## Features

✅ **Camera Capture**: Live camera preview with capture/retake options  
✅ **Image Optimization**: Images are automatically resized (max 800x800) and compressed  
✅ **Organized Storage**: Images are stored in Cloudinary folders by class ID  
✅ **Validation**: Students cannot submit offline attendance without taking a photo  
✅ **Responsive**: Works on both desktop and mobile browsers  
✅ **Privacy**: Only required for offline classes, online classes work normally  

## Troubleshooting

### Camera Not Working
- **Browser Permissions**: Make sure you've allowed camera access in your browser
- **HTTPS Required**: Camera API requires HTTPS in production (localhost works fine)
- **Browser Support**: Use modern browsers (Chrome, Firefox, Safari, Edge)

### Image Upload Fails
- **Check Credentials**: Verify your Cloudinary credentials in `.env`
- **Network Issues**: Ensure you have internet connectivity
- **Cloudinary Limits**: Free tier has upload limits, check your dashboard

### Environment Variables Not Loading
- **File Location**: Make sure `.env` is in the project root directory
- **Restart Server**: Always restart the server after changing `.env`
- **Syntax**: No spaces around the `=` sign in `.env` file

## Security Considerations

1. **Never commit `.env`**: The `.env` file is already in `.gitignore`
2. **Secure Storage**: Images are stored securely in Cloudinary
3. **Access Control**: Only teachers can view attendance images
4. **Privacy**: Students are informed before camera activation

## Cloudinary Dashboard

To view uploaded images:
1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Go to "Media Library"
3. Navigate to the "attendance" folder
4. Images are organized by class ID

## Production Deployment

When deploying to production (e.g., Render, Heroku):

1. Add environment variables in your hosting platform's dashboard
2. Ensure HTTPS is enabled (required for camera API)
3. Update CORS settings if needed
4. Monitor Cloudinary usage limits

## Support

For issues:
- Check server logs for error messages
- Verify all environment variables are set
- Test camera access in browser console: `navigator.mediaDevices.getUserMedia({ video: true })`
- Check Cloudinary upload limits in dashboard

---

**Note**: This feature only affects offline classes. Online classes continue to work without camera requirements.
