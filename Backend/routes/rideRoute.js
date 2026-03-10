import express from 'express';
import { postRide, getAllRides } from '../controller/rideController.js';

const rideRouter = express.Router();

rideRouter.post('/post-ride', postRide);
rideRouter.get('/all-rides', getAllRides);

export default rideRouter;