# SUST Digital Attendance System

A comprehensive location-based attendance system for Shahjalal University of Science and Technology (SUST) with offline/online class support, validation codes, and Google Sheets integration.

## Features

- 🔐 **Secure Authentication** - University email-based registration and login
- 📍 **Location Verification** - 50-meter proximity check for offline classes using geolocation
- 🔑 **Validation Codes** - Teacher-generated codes to prevent unauthorized attendance
- 📊 **Google Sheets Export** - Automatic export of sorted attendance records
- 🎨 **Modern UI** - Beautiful, responsive dark theme with glassmorphism effects
- ⚡ **Real-time Updates** - Dynamic class management and attendance tracking

## Tech Stack

### Backend
- **Node.js** + **Express** - RESTful API
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing
- **Google Sheets API** - Attendance export

### Frontend
- **HTML5** + **CSS3** - Modern, responsive design
- **Vanilla JavaScript** - No framework dependencies
- **Geolocation API** - Location-based verification

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Google Cloud Console account (for Sheets API)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DigitalAttendence
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up MongoDB
Make sure MongoDB is running on your system:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - run MongoDB service from Services
```

### 4. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

The `.env` file should contain:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your-secret-key-change-this-in-production
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
```

### 5. Set Up Google Sheets API (Optional but Recommended)

To enable attendance export to Google Sheets:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**
4. Create a **Service Account**:
   - Go to "Credentials" → "Create Credentials" → "Service Account"
   - Fill in the details and create
   - Click on the created service account
   - Go to "Keys" tab → "Add Key" → "Create new key" → Select "JSON"
   - Download the JSON file
5. Rename the downloaded file to `credentials.json` and place it in the project root
6. The service account email will be used to create sheets (they'll be owned by the service account)

**Note:** Without Google Sheets credentials, the system will work fine but the "Export to Google Sheets" feature will not be available.

## Running the Application

### Development Mode
```bash
npm run dev
```
This uses nodemon for auto-restart on file changes.

### Production Mode
```bash
npm start
```

The server will start at `http://localhost:3000`

## Usage Guide

### For Students

1. **Register/Login**
   - Use your SUST email: `XXXXXXXXXX@student.sust.edu` (10-digit registration number)
   - Create a password (minimum 6 characters)
   - Select "Student" as role

2. **Mark Attendance**
   - View active classes on your dashboard
   - Click on a class to open attendance form
   - For **offline classes**:
     - Allow browser location access
     - Ensure you're within 50 meters of the teacher
   - For **online classes**:
     - No location requirement
   - Enter the validation code provided by teacher
   - Submit attendance

3. **View History**
   - Check your attendance history on the dashboard
   - See which classes you've attended

### For Teachers

1. **Register/Login**
   - Use your SUST email: `yourname@sust.edu`
   - Create a password
   - Select "Teacher" as role

2. **Create a Class**
   - Fill in class name (e.g., "CSE 323 - Data Structures")
   - Select class type (Online or Offline)
   - Generate or enter a validation code
   - For **offline classes**:
     - Click "Get My Current Location"
     - Allow browser location access
   - Submit to create the class

3. **Manage Classes**
   - View all your classes
   - Update validation codes anytime
   - Activate/Deactivate classes
   - View attendance records
   - Export attendance to Google Sheets

4. **Export Attendance**
   - Click on "View Attendance" for any class
   - Click "Export to Google Sheets"
   - A new spreadsheet will be created with sorted registration numbers
   - Share the sheet link with relevant parties

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Classes (Protected Routes)
- `POST /api/classes/create` - Create class (Teacher only)
- `GET /api/classes/active` - Get all active classes
- `GET /api/classes/:classId` - Get class details
- `POST /api/classes/generate-code/:classId` - Update validation code (Teacher only)
- `PATCH /api/classes/:classId/toggle` - Toggle class status (Teacher only)
- `GET /api/classes/teacher/my-classes` - Get teacher's classes (Teacher only)

### Attendance
- `POST /api/attendance/submit` - Submit attendance (Student only)
- `GET /api/attendance/class/:classId` - Get class attendance (Teacher only)
- `GET /api/attendance/export/:classId` - Export to Google Sheets (Teacher only)
- `GET /api/attendance/my-attendance` - Get student's attendance history (Student only)

## Project Structure

```
DigitalAttendence/
├── models/
│   ├── User.js          # User schema (students & teachers)
│   ├── Class.js         # Class schema
│   └── Attendance.js    # Attendance records schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── classes.js       # Class management routes
│   └── attendance.js    # Attendance routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── utils/
│   ├── geolocation.js   # Haversine formula for distance
│   └── sheetsExport.js  # Google Sheets integration
├── public/
│   ├── index.html              # Landing/login page
│   ├── student-dashboard.html  # Student interface
│   ├── teacher-dashboard.html  # Teacher interface
│   ├── css/
│   │   └── style.css          # Design system
│   └── js/
│       ├── auth.js            # Authentication logic
│       ├── student.js         # Student dashboard logic
│       └── teacher.js         # Teacher dashboard logic
├── server.js            # Express server setup
├── package.json         # Dependencies
├── .env                 # Environment variables (create from .env.example)
└── README.md           # This file
```

## Security Considerations

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days
- Email format validation for SUST emails
- Role-based access control for routes
- CORS enabled for frontend-backend communication

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
```

### Location Permission Denied
- Ensure browser has location permissions enabled
- Use HTTPS in production (geolocation requires secure context)
- For local development, `localhost` is considered secure

### Google Sheets Export Fails
- Verify `credentials.json` is in the project root
- Check that Google Sheets API is enabled in Cloud Console
- Ensure the service account has proper permissions

## Future Enhancements

- Email notifications for attendance confirmation
- QR code-based attendance
- Bulk class creation from CSV
- Analytics dashboard for teachers
- Mobile app (React Native)
- Face recognition integration

## Deployment

### Deploying to Render (Free Tier)

1. **Create Account**: Sign up at [render.com](https://render.com).
2. **New Web Service**: Click **New +** > **Web Service**.
3. **Connect Repo**: Select your GitHub repository.
4. **Configure**:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

### Set Environment Variables

On the Render dashboard, go to the **Environment** tab for your service and add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Your production MongoDB connection string (from MongoDB Atlas) |
| `JWT_SECRET` | `...` | A secure random string (e.g., generated via `openssl rand -hex 32`) |
| `NODE_ENV` | `production` | Optimizes the application for production |

> **Note**: `PORT` is automatically set by Render. `GOOGLE_APPLICATION_CREDENTIALS` is not required for the current Excel export implementation.

## License

ISC

## Support

For issues or questions, contact the development team or create an issue in the repository.

---

**Developed for SUST** 🎓
