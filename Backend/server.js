// CHO 13-16: HTTP Module + Node.js server startup
const app  = require('./app');
const fs   = require('fs');
const path = require('path');

// CHO 5-8: Read config.env file manually using fs
const envPath = path.join(__dirname, 'config', 'config.env');
const envData = fs.readFileSync(envPath, 'utf8');

// Parse each line into process.env
envData.split('\n').forEach(function(line) {
  const [key, value] = line.split('=');
  if (key && value) {
    process.env[key.trim()] = value.trim();
  }
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, function() {
  console.log('╔══════════════════════════════════════╗');
  console.log(`║  EXPTRACK Server running on :${PORT}   ║`);
  console.log('╠══════════════════════════════════════╣');
  console.log('║  GET  /                → login.html  ║');
  console.log('║  POST /api/users/register            ║');
  console.log('║  POST /api/users/login               ║');
  console.log('║  GET  /api/rides                     ║');
  console.log('║  POST /api/rides                     ║');
  console.log('║  PATCH /api/rides/:id/book           ║');
  console.log('╚══════════════════════════════════════╝');
});