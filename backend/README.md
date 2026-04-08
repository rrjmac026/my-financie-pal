# Backend for My Finance Pal

This is the backend API for the My Finance Pal application, built with Node.js, Express, and MongoDB.

## Setup

1. Ensure you have Node.js and MongoDB installed.

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/my-financie-pal
   JWT_SECRET=your-secret-key-change-this
   PORT=5000
   ```

4. Start MongoDB service if using local MongoDB.

5. Run the server:
   ```
   npm run dev
   ```

The server will start on port 5000 by default.

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/users/me` - Get current user info (requires auth)

## Notes

- Change the JWT_SECRET in production.
- For production, use MongoDB Atlas or a cloud database.
- Add more routes as needed for expenses, budgets, etc.