# CreativeSocially Backend

This is the backend server for the CreativeSocially website, handling model applications and management.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/creativesocially
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   EMAIL_FROM=your-email@gmail.com
   
   # JWT Configuration
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRES_IN=7d
   ```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Models

- `GET /api/models` - Get all approved models
- `GET /api/models/:id` - Get model by ID
- `PATCH /api/models/:id` - Update model (admin only)
- `DELETE /api/models/:id` - Delete model (admin only)

### Applications

- `POST /api/applications` - Submit new application
- `GET /api/applications` - Get all applications (admin only)
- `GET /api/applications/:id` - Get application by ID (admin only)
- `PATCH /api/applications/:id/status` - Update application status (admin only)

## Features

- Model application submission
- Application status management
- Email notifications
- Admin dashboard endpoints
- Secure file uploads
- MongoDB integration
- JWT authentication

## Error Handling

The API includes comprehensive error handling for:
- Invalid requests
- Database errors
- File upload errors
- Email sending failures
- Authentication errors

## Security

- Environment variables for sensitive data
- JWT authentication for admin routes
- Input validation
- Secure file upload handling
- CORS configuration 