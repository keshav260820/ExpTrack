const express    = require('express');
const router     = express.Router();
const fs         = require('fs');
const path       = require('path');

const RIDE_FILE  = path.join(__dirname, '..', '..', 'mitraride', 'data', 'rides.json');
// OR if you have a separate rides.json in Backend:
// const RIDE_FILE = path.join(__dirname, '..', 'rides.json');

function readRides(callback) {
  fs.readFile(RIDE_FILE, 'utf8', function(err, data) {
    if (err) return callback(err.code === 'ENOENT' ? null : err, err ? [] : JSON.parse(data));
    try { callback(null, JSON.parse(data)); }
    catch(e) { callback(e, []); }
  });
}

function writeRides(rides, callback) {
  fs.writeFile(RIDE_FILE, JSON.stringify(rides, null, 2), 'utf8', callback);
}

// GET /api/rides — get all rides
router.get('/', function(req, res) {
  readRides(function(err, rides) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(200).json({ success: true, count: rides.length, rides });
  });
});

// POST /api/rides — create a ride
router.post('/', function(req, res) {
  const { from, to, seats, fare } = req.body;
  if (!from || !to || !seats || !fare) {
    return res.status(400).json({ success: false, message: 'from, to, seats, fare required' });
  }

  readRides(function(err, rides) {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const newRide = {
      id: rides.length + 1,
      ...req.body,
      totalSeats: seats,
      postedByMe: true,
      createdAt: new Date().toISOString()
    };
    rides.push(newRide);

    writeRides(rides, function(writeErr) {
      if (writeErr) return res.status(500).json({ success: false, message: writeErr.message });
      res.status(201).json({ success: true, message: 'Ride posted', ride: newRide });
    });
  });
});

// PATCH /api/rides/:id/book — book a seat
router.patch('/:id/book', function(req, res) {
  const rideId = parseInt(req.params.id);

  readRides(function(err, rides) {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const ride = rides.find(r => r.id === rideId);
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
    if (ride.seats <= 0) return res.status(409).json({ success: false, message: 'No seats available' });

    ride.seats -= 1;

    writeRides(rides, function(writeErr) {
      if (writeErr) return res.status(500).json({ success: false, message: writeErr.message });
      res.status(200).json({ success: true, message: 'Seat booked', ride });
    });
  });
});

// DELETE /api/rides/:id
router.delete('/:id', function(req, res) {
  const rideId = parseInt(req.params.id);

  readRides(function(err, rides) {
    if (err) return res.status(500).json({ success: false, message: err.message });

    const index = rides.findIndex(r => r.id === rideId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Ride not found' });

    const deleted = rides.splice(index, 1)[0];
    writeRides(rides, function(writeErr) {
      if (writeErr) return res.status(500).json({ success: false, message: writeErr.message });
      res.status(200).json({ success: true, message: 'Ride deleted', deleted });
    });
  });
});

module.exports = router;