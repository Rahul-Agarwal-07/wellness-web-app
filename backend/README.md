# Wellness Web App – Backend

This is the backend of the **Wellness Web App**, built with **Node.js**, **Express**, and **MongoDB**. It provides RESTful APIs for user authentication, session management, and session notes.

---

## 🌐 API Base URL

```
http://localhost:5000/api
```

---

## 📁 Project Structure

```
backend
├── controllers/        # Handles business logic
├── middleware/         # Auth and error handling
├── models/             # Mongoose schemas
├── routes/             # API route definitions
├── .env                # Environment config
├── server.js           # Entry point
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Rahul-Agarwal-07/wellness-web-app.git
cd wellness-web-app/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```bash
touch .env
```

Fill it with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the Server

```bash
npm run dev
```

> Server runs on: `http://localhost:5000`

---

## 📦 API Endpoints

### 🔐 Auth Routes

#### `POST /api/auth/register`

Register a new user

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### `POST /api/auth/login`

Login a user and return JWT

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

---

### 📘 Session Routes

#### `GET /api/sessions`
Get all sessions (public or user-specific)

#### `GET /api/sessions/:id`
Get a session by ID

#### `GET /api/my-sessions`
Get User's (Draft + Published) sessions

#### `POST /api/my-sessions/save-draft`
saves a draft session

**Requires Authorization Header**

**Request Body:**
```json
{
  "title": "Therapy Session",
  "jsonFileUrl": "Talked about anxiety.",
  "tags" : ["yoga", "meditation"],
  "isPublic": false
}
```

#### `POST /api/my-sessions/publish`
publishes a draft session

**Requires Authorization Header**

**Request Body:**
```json
{
  "id" : "sdjklasdwdsfwwf",
}
```

#### `DELETE /api/sessions/:id`
Delete a session

---

## 🔐 Authentication

Protected routes require a JWT token sent in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

You get the token after login.

---

## 🧪 Testing the API

Use tools like:

- Postman
- Thunder Client (VSCode Extension)
- curl

**Example using curl:**

```bash
curl -X GET http://localhost:5000/api/sessions   -H "Authorization: Bearer <your_token>"
```

---

## 🛠 Built With

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- dotenv
- bcrypt.js

---

## 📌 Future Improvements

- JSON Parser to view session details in app
- Enhancing User Experience
- Rate limiting and logging middleware
- Validation using Joi or express-validator
- Unit tests with Jest

---

## 📄 License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
