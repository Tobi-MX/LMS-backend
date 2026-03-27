# LMS-Backend
Backend for a full-featured LMS supporting authentication, course management, AI-powered features, and real-time discussions.

---

## 🛠️ Tech Stack
- **Framework**: Express 5.x (Node.js)
- **Database**: MongoDB + Mongoose (v9)
- **Auth**: JWT + Bcryptjs
- **Media**: Cloudinary (Multer)
- **Comm**: Resend (Transactional Emails)
- **AI**: Google Generative AI (Gemini)

---

## 🚀 Getting Started

### Quick Setup
1.  **Install**: `npm install`
2.  **Env Config**: Create a `.env` file based on `src/config/env.js`:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    RESEND_API_KEY=re_xxx
    EMAIL_FROM=onboarding@resend.dev
    CLIENT_URL=http://localhost:5173
    CLOUDINARY_CLOUD_NAME=xxx
    CLOUDINARY_API_KEY=xxx
    CLOUDINARY_API_SECRET=xxx
    GEMINI_API_KEY=xxx
    ```
    ⚠️ *Missing or invalid environment variables will prevent the server from starting correctly.*
3.  **Run**: `npm run dev`

---

## 📁 Project Structure

- `src/config`: App config and DB connection.
- `src/controllers`: Request/Response handling.
- `src/middleware`: Authentication, authorization, and error handling.
- `src/models`: Mongoose schemas (User, Course, Quiz, etc.).
- `src/routes`: API endpoint definitions.
- `src/services`: Core business logic (kept separate from controllers).
- `src/utils`: Reusable helper functions (e.g., token generation).

---

## 🏗️ Architecture & Request Flow

The system follows a **Layered Architecture** (Controller-Service-Model):

1.  **Entry**: Hits `src/server.js` (Cors, JSON parsing).
2.  **Routing**: Directed to specific module in `src/routes/`.
3.  **Middleware**: Auth/Validation checks in `src/middleware/`.
4.  **Controller**: Extracts data and calls the appropriate service.
5.  **Service**: Executes business logic and interacts with the **Model**.
6.  **Response**: Controller sends data back to the client.

---

## 🛰️ API Reference (Core)

| Prefix | Module | Functionality |
| :--- | :--- | :--- |
| `/api/auth` | **Auth** | Signup, Login, Password Reset, Email Verification |
| `/api/courses` | **Course** | Management, Enrollment, Metadata |
| `/api/ai` | **AI** | *Quiz generation and course suggestions powered by Google Gemini* |
| `/api/quizzes` | **Quiz** | Assessment creation and attempt logic |
| `/api/discussions` | **Forum** | Threaded comments and replies |

---

### 💡 API Example: User Login
**POST** `/api/auth/login`
```json
// Request
{
  "email": "user@example.com",
  "password": "securepassword123"
}

// Response (200 OK)
{
  "success": true,
  "message": "Logged in successfully",
  "user": { "name": "John Doe", "email": "user@example.com", "role": "student" }
}
```

---

## ⚠️ Common Pitfalls

- **Middleware Order**: `authenticate` must always precede `isVerifiedAndApproved` or `authorize`.
- **Async Errors**: Always use `next(error)` in controllers to ensure they reach the global handler.
- **Service Dependency**: Avoid calling controllers from services; keep services logic-pure.
