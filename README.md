# Letter Monitoring System

A comprehensive letter monitoring system with role-based access control for User, SSM (Senior Section Manager), and GM (General Manager) roles.

## Features

### User (Read-Only)
- View all letters submitted by the user
- Read-only access to letter details and status

### SSM (Senior Section Manager)
- Send letters to GM
- Check status of sent messages
- Manage users (add, edit, delete)
- Change password
- Access reports
- View letters sent and received

### GM (General Manager)
- Verify all messages from SSMs
- Approve, reject, or close letters
- Send messages back to originating users
- Change password
- Access comprehensive reports
- View all letters in the system

## Technology Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18
- React Router for navigation
- Context API for state management
- Axios for API calls
- Webpack for bundling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGO_URI=mongodb://localhost:27017/letter_monitoring
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the project root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:8080`

## Database Setup

### Create Initial Users

You can create initial users by adding them directly to the MongoDB database or by creating a seed script. Here are some example users:

```javascript
// Example users (passwords are hashed versions of "password123")
{
  "username": "user1",
  "password": "$2a$10$...", // hashed "password123"
  "role": "user"
},
{
  "username": "ssm1", 
  "password": "$2a$10$...", // hashed "password123"
  "role": "ssm"
},
{
  "username": "gm1",
  "password": "$2a$10$...", // hashed "password123" 
  "role": "gm"
}
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/change-password` - Change password (authenticated)

### Letters
- `GET /api/letters` - Get letters (role-based filtering)
- `POST /api/letters` - Create new letter
- `GET /api/letters/:id` - Get specific letter
- `PUT /api/letters/:id` - Update letter status

### User Management (SSM/GM only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Usage

1. **Login**: Access the application and login with your credentials
2. **Role-based Dashboard**: Based on your role, you'll see different features:
   - **User**: View your submitted letters
   - **SSM**: Send letters to GM, manage users, view reports
   - **GM**: Verify letters, approve/reject/close, view all reports

3. **Letter Workflow**:
   - Users can submit letters (if implemented in UI)
   - SSMs can send letters to GM
   - GMs can verify, approve, reject, or close letters
   - Status updates are reflected in real-time

## Project Structure

```
new LMS/
├── backend/
│   ├── config/
│   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── letterController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── Letter.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── letters.js
│   │   ├── server.js
│   │   └── package.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── gm/
│   │   │   ├── ssm/
│   │   │   └── user/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── package.json
│   └── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGO_URI in your .env file
   - Verify network connectivity

2. **JWT Token Issues**
   - Check JWT_SECRET is set in .env
   - Ensure token is being sent in Authorization header

3. **CORS Issues**
   - Backend has CORS enabled for development
   - Check if frontend and backend ports match

4. **Authentication Issues**
   - Verify user credentials in database
   - Check if password is properly hashed
   - Ensure JWT token is valid

## Development

### Adding New Features
1. Create new routes in `backend/routes/`
2. Add controllers in `backend/controllers/`
3. Update models if needed
4. Create React components in `src/components/`
5. Update services for API calls

### Testing
- Backend: Use Postman or similar tool to test API endpoints
- Frontend: Test user flows manually

## Security Considerations

- Change the JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting
- Add input validation
- Use environment variables for sensitive data
- Implement proper error handling

## License

This project is for educational purposes. 