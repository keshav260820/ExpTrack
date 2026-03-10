import express from 'express';
import { postRide, getAllRides, updateRideSeats } from '../controller/rideController.js';

const rideRouter = express.Router();

rideRouter.post('/post-ride', postRide);
rideRouter.get('/all-rides', getAllRides);

rideRouter.patch('/update-seats/:id', updateRideSeats);

export default rideRouter;