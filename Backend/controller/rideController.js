import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ridesFilePath = path.join(__dirname, '..', 'database', 'rides.json');

export const postRide = (req, res) => {
    const newRide = req.body;
    fs.readFile(ridesFilePath, 'utf8', (err, data) => {
        let rides = [];
        if (!err && data) {
            try { rides = JSON.parse(data); } catch (e) { rides = []; }
        }
        rides.push({ id: Date.now(), ...newRide });
        fs.writeFile(ridesFilePath, JSON.stringify(rides, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Error saving to JSON" });
            res.status(201).json({ message: "Ride posted successfully!" });
        });
    });
};

export const getAllRides = (req, res) => {
    fs.readFile(ridesFilePath, 'utf8', (err, data) => {
        if (err) return res.status(200).json([]);
        try {
            const rides = JSON.parse(data || "[]");
            res.status(200).json(rides);
        } catch (e) {
            res.status(200).json([]);
        }
    });
};

export const updateRideSeats = (req, res) => {
    const rideId = parseInt(req.params.id);
    const { bookedSeats } = req.body;

    fs.readFile(ridesFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading data" });

        let rides = JSON.parse(data || "[]");
        const rideIndex = rides.findIndex(r => r.id === rideId);

        if (rideIndex !== -1) {
            const currentSeats = parseInt(rides[rideIndex].seats);
            if (currentSeats >= bookedSeats) {
                rides[rideIndex].seats = currentSeats - bookedSeats;
                fs.writeFile(ridesFilePath, JSON.stringify(rides, null, 2), (err) => {
                    if (err) return res.status(500).json({ message: "Error updating seats" });
                    res.status(200).json({ message: "Booking confirmed" });
                });
            } else {
                res.status(400).json({ message: "Not enough seats available" });
            }
        } else {
            res.status(404).json({ message: "Ride not found" });
        }
    });
};