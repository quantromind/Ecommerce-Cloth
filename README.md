# Ecommerce Project

This is a full-stack Ecommerce web application. It features a React-based frontend and an Express/Node.js backend connected to a MongoDB cloud database.

## Project Structure

```
Ecommerce/
├── backend/          # Express backend application
│   ├── src/          # Source files (models, routes, controllers)
│   ├── server.js     # Entry point
│   ├── app.js        # Express configuration
│   └── package.json  # Backend dependencies and scripts
│
└── frontend/         # React frontend application
    ├── src/          # React components and views
    ├── public/       # Public static files
    └── package.json  # Frontend dependencies and scripts
```

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with MongoDB connection string, PORT, etc.
4. Run the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development application:
   ```bash
   npm start
   ```
