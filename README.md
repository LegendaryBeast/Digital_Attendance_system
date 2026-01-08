# Digital Attendance System - Clean Architecture

This is the refactored Digital Attendance System following SOLID principles with complete backend/frontend separation.

## 📁 Project Structure

```
DigitalAttendence/
├── backend/              # Backend API (Port 3000)
│   ├── src/
│   │   ├── config/      # Configuration management
│   │   ├── repositories/# Data access layer
│   │   ├── services/    # Business logic
│   │   ├── controllers/ # HTTP handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # Route definitions
│   │   ├── middleware/  # Auth & validation
│   │   ├── utils/       # Utilities
│   │   ├── container.js # Dependency injection
│   │   ├── app.js       # Express config
│   │   └── server.js    # Entry point
│   ├── .env
│   └── package.json
│
├── frontend/            # Frontend App (Port 5500)
│   ├── src/
│   │   ├── api/        # API service layer
│   │   ├── services/   # Frontend services
│   │   ├── ui/         # UI components
│   │   ├── pages/      # HTML pages
│   │   └── utils/      # Constants
│   ├── css/
│   └── package.json
│
├── start.sh            # Quick start script
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running instance or Atlas)

### Running the Application

**Option 1: One-Command Start**
```bash
./start.sh
```

**Option 2: Manual Start**

Terminal 1 - Backend:
```bash
cd backend
npm install  # First time only
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm install  # First time only
npm start
```

### Access
Open browser to: **http://localhost:5500**

## 🏗️ Architecture Highlights

### SOLID Principles Applied

- **Single Responsibility**: Each class has one job
- **Open/Closed**: Extensible without modification
- **Liskov Substitution**: Interchangeable implementations
- **Interface Segregation**: Focused interfaces
- **Dependency Inversion**: Depend on abstractions

### Backend Layers
1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Contain business logic
3. **Repositories** - Manage data access
4. **Models** - Define data structure

### Frontend Modules
1. **API Layer** - Centralized backend communication
2. **Services** - Frontend logic (Camera, Location)
3. **UI Components** - Modular, reusable elements

## 🎯 Features

- ✅ JWT Authentication
- ✅ Online & Offline Classes
- ✅ Location-based Verification
- ✅ Photo Verification
- ✅ Excel Export
- ✅ Attendance History

## 🔧 Environment Setup

### Backend (.env in backend/)
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

## 📝 Development

### Adding Features
1. Create repository methods (data access)
2. Create service methods (business logic)
3. Create controller methods (HTTP handling)
4. Add routes
5. Update frontend API classes
6. Update UI components

## 🧪 Testing

Test the application manually:
- Register/login as student and teacher
- Create classes (online/offline)
- Submit attendance
- View attendance records
- Export to Excel

## 🆘 Troubleshooting

**Backend won't start:**
- Check MongoDB connection
- Verify .env file exists
- Ensure port 3000 is available

**Frontend can't connect:**
- Ensure backend is running on port 3000
- Check browser console for errors

## 📚 Documentation

For detailed architecture and SOLID principles explanation, see the walkthrough documentation in the artifacts.

## 🎓 Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: Vanilla JS, HTML5, CSS3
- **Auth**: JWT
- **Storage**: Cloudinary (images)
- **Export**: ExcelJS

---

**Note**: This is a refactored version following enterprise-level SOLID principles for maintainability and scalability.
