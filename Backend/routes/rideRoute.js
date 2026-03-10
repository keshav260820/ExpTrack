const express = require('express');
const router = express.Router();
const rideController = require('../controller/rideController');

// Syllabus 21-24: Routing methods (POST)
router.post('/post-ride', rideController.postRide);

module.exports = router;

// Add this to your rideRoute.js
import { postRide, getAllRides } from '../controller/rideController.js';

router.post('/post-ride', postRide);
router.get('/all-rides', getAllRides); // New GET route