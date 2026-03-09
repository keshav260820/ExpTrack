const express = require('express');
const router  = express.Router();
const { registerUser, loginUser, getProfile } = require('../controller/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getProfile);

module.exports = router;