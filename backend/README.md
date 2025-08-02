# Wellness Web App – Backend

This is the backend of the **Wellness Web App**, built with **Node.js**, **Express**, and **MongoDB**. It provides RESTful APIs for user authentication, session management, and session notes.

---

## 🌐 API Base URL

http://localhost:5000/api

---

## 📁 Project Structure

backend/
├── controllers/ # Handles business logic
├── middleware/ # Auth and error handling
├── models/ # Mongoose schemas
├── routes/ # API route definitions
├── utils/ # Helper functions
├── .env # Environment config
├── server.js # Entry point
└── package.json

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Rahul-Agarwal-07/wellness-web-app.git
cd wellness-web-app/backend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Create .env File
bash
Copy
Edit
touch .env
Fill it with the following:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
4. Run the Server
bash
Copy
Edit
npm run dev
Server runs on: http://localhost:5000

📦 API Endpoints
🔐 Auth Routes
POST /api/auth/register
Register a new user

Request Body:

json
Copy
Edit
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
POST /api/auth/login
Login a user and return JWT

Request Body:

json
Copy
Edit
{
  "email": "john@example.com",
  "password": "yourpassword"
}
👤 User Routes
GET /api/users/:id
Get user by ID

PUT /api/users/:id
Update user details

📘 Session Routes
GET /api/sessions
Get all sessions (public or user-specific)

GET /api/sessions/:id
Get a session by ID

POST /api/sessions
Create a new session

Requires Authorization Header

Request Body:

json
Copy
Edit
{
  "title": "Therapy Session",
  "description": "Talked about anxiety.",
  "isPublic": false
}
PUT /api/sessions/:id
Update a session

DELETE /api/sessions/:id
Delete a session

📝 Note Routes
POST /api/notes
Create a new note for a session

Request Body:

json
Copy
Edit
{
  "sessionId": "SESSION_ID_HERE",
  "text": "This was an important note."
}
GET /api/notes/session/:sessionId
Get all notes for a session

DELETE /api/notes/:id
Delete a note

🔐 Authentication
Protected routes require a JWT token sent in the Authorization header:

makefile
Copy
Edit
Authorization: Bearer <your_token>
You get the token after login.

🧪 Testing the API
Use tools like:

Postman

Thunder Client (VSCode Extension)

curl

Example using curl:

bash
Copy
Edit
curl -X GET http://localhost:5000/api/sessions \
  -H "Authorization: Bearer <your_token>"
🛠 Built With
Node.js

Express.js

MongoDB + Mongoose

JSON Web Token (JWT)

dotenv

bcrypt.js

📌 Future Improvements
Add Swagger API documentation

Rate limiting and logging middleware

Validation using Joi or express-validator

Unit tests with Jest

📄 License
This project is open-source and available under the MIT License.
