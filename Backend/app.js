const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const studentroutes = require('./routes/studentRoutes');
const hodRoutes = require('./routes/hodRoutes');
const placeOfficeroutes = require('./routes/PlaceOfficeroutes');
const driveroutes = require('./routes/driveroutes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON requests
app.use('/students',studentroutes);
app.use('/hods',hodRoutes);
app.use('/placeofficers',placeOfficeroutes);
app.use('/drives',driveroutes);



// Error Handling Middleware
app.use(errorHandler);

module.exports = app;