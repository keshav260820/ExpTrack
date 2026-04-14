import Ride from "../models/Ride.js";

// CREATE RIDE
export const postRide = async (req, res) => {
    try {
        const {
            pickup,
            destination,
            date,
            time,
            vehicleType,
            fare,
            seats,
            amenities
        } = req.body;

        const newRide = await Ride.create({
            userId: req.userId, 
            pickup,
            destination,
            date,
            time,
            vehicleType,
            fare,
            seats,
            amenities
        });

        res.status(201).json({
            message: "Ride posted successfully!",
            ride: newRide
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET ALL RIDES
export const getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find().populate("userId");

        res.status(200).json(rides);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE SEATS 
export const updateRideSeats = async (req, res) => {
    try {
        const rideId = req.params.id;
        const { bookedSeats } = req.body;

        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.seats >= bookedSeats) {
            ride.seats -= bookedSeats;
            await ride.save();

            res.status(200).json({ message: "Booking confirmed" });
        } else {
            res.status(400).json({ message: "Not enough seats available" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};