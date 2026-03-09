// CHO 21-24: Express Framework
const express    = require('express');
const path       = require('path');
const app        = express();

// Import routes (CHO 17-20: require modules)
const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');

// ── MIDDLEWARE ────────────────────────────────────────────────────
// Parse incoming JSON body (like express.json())
app.use(express.json());

// Serve Frontend HTML files as static files (CHO 21-24)
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Request logger middleware
app.use(function(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── ROUTES ───────────────────────────────────────────────────────
app.use('/api/users', userRoutes);  // All user routes
app.use('/api/rides', rideRoutes);  // All ride routes

// Root → serve login page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'Frontend', 'login.html'));
});

// 404 handler (CHO 21-24: Handling exceptions)
app.use(function(req, res) {
  res.status(404).json({ success: false, message: 'Route not found: ' + req.url });
});

// Error handler
app.use(function(err, req, res, next) {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

module.exports = app;