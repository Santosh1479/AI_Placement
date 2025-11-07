const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON requests

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;