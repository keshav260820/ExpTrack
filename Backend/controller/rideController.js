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

        // Add unique ID and save
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
        const rides = JSON.parse(data || "[]");
        res.status(200).json(rides);
    });
};