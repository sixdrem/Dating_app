# Dating App

A fullstack dating app built with React (frontend) and Express/MongoDB (backend).

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/sixdrem/Dating_app.git
cd Dating_app
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret:
echo "MONGO_URI=your_mongo_uri" > .env
echo "JWT_SECRET=your_jwt_secret" >> .env
npm start
```

### 3. Frontend Setup (for development)
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Production Build (for deployment)
```bash
cd frontend
npm run build
cp -r dist ../backend/public
# Serve with backend as described above
```

## 🌐 Deployment
- The backend serves the frontend build from `backend/public`.
- Deploy the `backend/` folder to Render or similar, set environment variables in the dashboard.

## 📝 Design Trade-offs & Assumptions

- **Authentication:** JWT-based, stateless sessions.
- **File Uploads:** Handled via Multer, stored locally in `/uploads` (for production, consider cloud storage).
- **Frontend/Backend Split:** Developed separately for flexibility, merged for deployment.
- **Pagination:** Simple skip/limit for user browsing.
- **Assumption:** Only basic profile info and matching logic; not production-hardened.

## 🗄️ Database Schema

### User
```js
{
  _id: ObjectId,
  email: String,
  password: String // (hashed)
}
```

### Profile
```js
{
  _id: ObjectId,
  userId: ObjectId, // (ref User)
  name: String,
  about: String,
  interests: [String],
  avatar: String // (file path)
}
```

### Like
```js
{
  _id: ObjectId,
  from: ObjectId, // (ref User)
  to: ObjectId // (ref User)
}
```

## 🧪 API Examples

### Signup
```bash
curl -X POST https://your-backend-url/api/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password"}'
```

### Login
```bash
curl -X POST https://your-backend-url/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password"}'
```

### Get Profile
```bash
curl -H "Authorization: Bearer <token>" https://your-backend-url/api/profile/me
```

---

## (Optional) Postman/Insomnia Collection

- You can export your API requests from Postman/Insomnia and add the JSON file to your repo (e.g., `DatingApp.postman_collection.json`). 