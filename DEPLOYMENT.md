# 🚀 Deployment Guide

This guide covers how to deploy the **Backend to Railway** and the **Frontend to Vercel**.

## 🛑 Critical Step Before deploying

Before deploying the frontend, you must update the API key to point to your live backend.

1.  Deploy the **Backend** first (follow Part 1 below).
2.  Copy your **new Backend domain** (e.g., `https://web-production-xxx.up.railway.app`).
3.  Update `frontend/src/js/auth.js`:
    ```javascript
    // Change LOCALHOST to your LIVE Backend URL
    window.API_URL = 'https://your-backend-url.up.railway.app/api'; 
    ```
    *(Note: Keep the `/api` at the end)*
4.  Commit and push this change to GitHub before deploying the Frontend.

---

## Part 1: Backend Deployment (Railway)

Railway is excellent for deploying Node.js apps with MongoDB.

### Prerequisites
*   A [Railway](https://railway.app/) account
*   This project pushed to GitHub

### Steps
1.  **New Project**: Go to Railway Dashboard → Click **New Project** → **Deploy from GitHub repo**.
2.  **Select Repository**: Choose `Digital_Attendance_system`.
3.  **Variable Setup**:
    *   Click on the new card for your project.
    *   Go to **Variables**.
    *   Add the variables from your `backend/.env` file:
        *   `MONGODB_URI`: Your production MongoDB connection string (or add a MongoDB plugin in Railway).
        *   `JWT_SECRET`: A strong secret key.
        *   `CLOUDINARY_CLOUD_NAME`: (If using image upload)
        *   `CLOUDINARY_API_KEY`: ...
        *   `CLOUDINARY_API_SECRET`: ...
4.  **Settings**:
    *   Go to **Settings**.
    *   Under **Root Directory**, enter: `backend`
    *   Under **Start Command**, ensure it is: `npm start`
    *   Click **Generate Domain** to get your public URL.
5.  **Verify**: Open the generated URL (e.g., `https://xxx.up.railway.app/`). It should show `Cannot GET /` (which is normal) or your API root if configured.

**🎉 Backend is now live! Copy the URL.**

---

## Part 2: Frontend Deployment (Vercel)

Vercel is the best place for static frontend sites.

### Prerequisites
*   A [Vercel](https://vercel.com/) account.
*   **UPDATED `auth.js`** with the Railway URL (See "Critical Step" above).

### Steps
1.  **Add New Project**: Go to Vercel Dashboard → **Add New** → **Project**.
2.  **Import Git Repository**: Access your GitHub and import `Digital_Attendance_system`.
3.  **Framework Preset**: Select **Other**.
4.  **Root Directory**: 
    *   Click `Edit` next to **Root Directory**.
    *   Select `frontend` folder.
    *   (Important: Vercel defaults to root, but your site is in `frontend`)
5.  **Build & Output Settings**:
    *   **Output Directory**: `src` (Because your `index.html` is inside `src`).
    *   *If Vercel doesn't allow setting Output Directory without a Build Command, you might need to adjust settings or simply set Root Directory to `frontend/src` directly.*
    *   **Simpler Method**:
        *   Set **Root Directory** to: `frontend/src`
        *   leave everything else default.
6.  **Deploy**: Click **Deploy**.

### Verification
*   Visit the URL provided by Vercel.
*   Try Logging in. It should talk to your Railway backend.

---

## 🔄 Deployment Workflow

When you make changes:
1.  **Backend Changes**: Push to GitHub. Railway will auto-redeploy using the `backend` folder.
2.  **Frontend Changes**: Push to GitHub. Vercel will auto-redeploy using the `frontend/src` folder.

**Done! 🚀**
