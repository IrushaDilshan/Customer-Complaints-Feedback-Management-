const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Simple request logger for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Healthcheck endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.warn('MONGO_URI is not set. Please set it in your .env file to enable persistence.');
}

mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB || undefined })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

// Routes
const complaintsRoutes = require('./routes/complaints');
const feedbackRoutes = require('./routes/feedback');
const feedbackInviteRoutes = require('./routes/feedbackInvite');

app.use('/api/complaints', complaintsRoutes);
// Feedback endpoints are used by frontend at /feedback
app.use('/feedback', feedbackRoutes);
app.use('/api/feedback', feedbackInviteRoutes); // exposes /api/feedback/session/:id/invite and /api/feedback/submit

// ======================= Server =======================
const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
