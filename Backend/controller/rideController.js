const fs = require('fs');
const path = require('path');

// Syllabus 5-8: File handling module
const ridesFilePath = path.join(__dirname, '..', 'rides.json');

exports.postRide = (req, res) => {
    const newRide = req.body;

    // 1. Read existing rides (File Handling)
    fs.readFile(ridesFilePath, 'utf8', (err, data) => {
        let rides = [];
        if (!err && data) {
            rides = JSON.parse(data);
        }

        // 2. Add the new ride
        rides.push({ id: Date.now(), ...newRide });

        // 3. Save back to file (Syllabus 5-8: Writing files)
        fs.writeFile(ridesFilePath, JSON.stringify(rides, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: "Error saving ride" });
            }
            // Syllabus 24: Response Method
            res.status(201).json({ message: "Ride posted successfully!" });
        });
    });
};

export const getAllRides = (req, res) => {
    // Syllabus 5-8: Reading the file
    fs.readFile(userFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Failed to load rides" });
        }
        
        // Syllabus 24: Sending a JSON response
        const rides = JSON.parse(data || "[]");
        res.status(200).json(rides);
    });
};