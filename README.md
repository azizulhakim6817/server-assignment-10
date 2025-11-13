# Food Donation Platform - Server

This is the backend for the **Food Donation Platform**, built with Node.js, Express, and MongoDB (Mongoose). It handles food donations, requests, and user authentication using Firebase Admin SDK.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** Firebase Admin SDK (ID token verification)
- **Middleware:** verifyToken for protected routes
- **CORS & Security:** Configured for client access

---

## 📂 Project Structure

/server
/src
/controllers
food.controller.js
request.controller.js
/models
food.model.js
request.model.js
/routes
food.routes.js
request.routes.js
/middlewares
verifyToken.js
server.js
package.json

yaml
Copy code

---

## 🔑 Environment Variables

Create a `.env` file in `/server`:

PORT=5000
MONGO_URI=your_mongodb_connection_string
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/firebase-service-account.json

yaml
Copy code

- `MONGO_URI`: Your MongoDB connection string
- `FIREBASE_SERVICE_ACCOUNT_PATH`: JSON file for Firebase Admin SDK

---

## 🚀 Setup Instructions

### 1️⃣ Install dependencies

```bash
cd server
npm install
2️⃣ Run development server
bash
Copy code
npm run dev
Server runs on http://localhost:5000 (default)

📝 API Endpoints
Food Endpoints
Method	Endpoint	Description
GET	/api/foods/featured	Get 6 featured foods (sorted by quantity)
GET	/api/foods	Get all available foods (food_status="Available")
GET	/api/foods/:id	Get single food by ID
POST	/api/foods	Add food (protected; validate Firebase token)
PATCH	/api/foods/:id	Update food (protected; only owner)
DELETE	/api/foods/:id	Delete food (protected; only owner)

Request Endpoints
Method	Endpoint	Description
POST	/api/requests	Create food request (protected)
GET	/api/requests/food/:foodId	Get requests for a food (owner only)
PATCH	/api/requests/:id/accept	Accept request + mark food as donated
PATCH	/api/requests/:id/reject	Reject request

🔐 Authentication (Server-side)
All protected routes use verifyToken middleware

verifyToken validates Firebase ID token:

javascript
Copy code
const idToken = req.headers.authorization?.split(' ')[1];
const decodedToken = await admin.auth().verifyIdToken(idToken);
req.user = { uid: decodedToken.uid, email: decodedToken.email };
next();
Only logged-in users can create/update/delete food or requests

🗄️ Database Models
Food Model (foods collection)
javascript
Copy code
{
  name: String,
  image_url: String,
  quantity: String, // "Serves 2 people"
  pickup_location: String,
  expire_date: Date,
  notes: String,
  donator: {
    uid: String,
    name: String,
    email: String,
    photoURL: String
  },
  food_status: { type: String, default: "Available" },
  createdAt: Date
}
Request Model (requests collection)
javascript
Copy code
{
  foodId: ObjectId, // ref to Food
  requester: { uid, name, email, photoURL },
  locationText: String,
  whyNeed: String,
  contactNo: String,
  status: { type: String, default: "pending" },
  createdAt: Date
}
🧪 Testing Checklist
Add, update, delete food (verify owner protection)

Fetch all available foods

Fetch featured foods (sorted by quantity)

Create requests (protected)

Accept/Reject requests (verify food_status changes)

Verify unauthorized requests are blocked

📌 GitHub Commit Suggestions
init: express server + mongoose connection

add: Food model + basic CRUD

add: Request model + create request endpoint

add: verifyToken middleware (Firebase Admin)

add: endpoints for accept/reject request + transactional logic

add: CORS/security headers + env config

add: pagination/filter for available foods

add: deploy configuration + README update

⚡ Deployment Notes
Ensure MONGO_URI and FIREBASE_SERVICE_ACCOUNT_PATH are correctly set in environment variables

Allow client domain in Firebase Authentication (if using protected routes)

Set CORS to allow your frontend origin

Use secure environment variables when deploying (Vercel, Render, Heroku, etc.)
```
