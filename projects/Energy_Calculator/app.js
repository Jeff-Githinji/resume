// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');

// Initialize Express app and MongoDB client
const app = express();
const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();

// Middleware to parse JSON requests
app.use(express.json());

// Define route handler for POST requests to /register
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const collection = client.db('login').collection('users');
    try {
        // Check if user with the provided email already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
        } else {
            // Insert new user data into the database
            await collection.insertOne({ email, password });
            res.json({ message: 'Registration successful' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
const port = 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));


