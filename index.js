const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample in-memory data
let items = [
    { id: 1, name: 'Item 1', description: 'This is item 1' },
    { id: 2, name: 'Item 2', description: 'This is item 2' },
];

const filePath = path.join(__dirname, 'locations.txt');

const HARD_CODED_TOKEN = "my-secure-token";

function authenticateToken(req, res, next) {
    const token = req.header('Authentication');
    if (token !== HARD_CODED_TOKEN) {
        return res.status(401).json({ message: 'Unauthorized. Invalid or missing token.' });
    }
    next();
}

// Login endpoint to return the hardcoded token
app.post('/login', (req, res) => {
    res.status(200).json({ token: HARD_CODED_TOKEN });
});

// 2. Get a specific item by ID
app.get('/locations', authenticateToken, (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Failed to read locations file.' });
        }

        // Parse locations into JSON
        const locations = data
            .split('\n') // Split lines
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(line => {
                const [lon, lat] = line.split(':');
                return { lon: parseFloat(lon), lat: parseFloat(lat) }; // Parse to numbers
            });

        res.status(200).json(locations);
    });
});

// 3. Create a new item
app.post('/locations', authenticateToken, (req, res) => {
    const { lon, lat } = req.body;

    // Validate input
    if (typeof lon !== 'number' || typeof lat !== 'number') {
        return res.status(400).json({ message: 'Invalid input. lon and lat must be numbers.' });
    }

    // Prepare the data to be saved with a newline
    const locationData = `${lon}:${lat}\n`; // Adding newline after each location
  
    fs.appendFile(filePath, locationData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ message: 'Failed to save location.' });
      }
  
      res.status(200).json({ message: 'Location saved successfully.' });
    });
});

// 5. Delete an item by ID
app.delete('/locations', authenticateToken, (req, res) => {
    const { lon, lat } = req.body;

    // Validate input
    if (typeof lon !== 'number' || typeof lat !== 'number') {
        return res.status(400).json({ message: 'Invalid input. lon and lat must be numbers.' });
    }

    const locationToDelete = `${lon}:${lat}`;

    // Read the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Failed to read locations file.' });
        }

        // Split locations into lines and filter out the one to delete
        const locations = data.split('\n').filter(line => line.trim() !== locationToDelete);

        // Join the remaining locations and write them back to the file
        fs.writeFile(filePath, locations.join('\n'), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to file:', writeErr);
                return res.status(500).json({ message: 'Failed to update locations file.' });
            }
            res.status(200).json({ message: 'Location deleted successfully.' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
