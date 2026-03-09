// CHO 21-24: Route Handler functions
const { readUsers, writeUsers } = require('../database/dbConnection');

// POST /api/users/register
function registerUser(req, res) {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password are required'
    });
  }

  readUsers(function(err, users) {
    if (err) return res.status(500).json({ success: false, message: err.message });

    // Check if email already exists
    const exists = users.find(u => u.email === email);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const newUser = {
      id:       users.length + 1,
      name,
      email,
      password, // In real app: hash this with bcrypt
      role:     'passenger',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    writeUsers(users, function(writeErr) {
      if (writeErr) return res.status(500).json({ success: false, message: writeErr.message });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    });
  });
}

// POST /api/users/login
function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  readUsers(function(err, users) {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  });
}

// GET /api/users/:id
function getProfile(req, res) {
  const userId = parseInt(req.params.id);

  readUsers(function(err, users) {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't send password back
    const { password, ...safeUser } = user;
    res.status(200).json({ success: true, user: safeUser });
  });
}

module.exports = { registerUser, loginUser, getProfile };