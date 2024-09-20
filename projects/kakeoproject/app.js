const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('users', userSchema);

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!password) {
            return res.status(400).send('Password is required');
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); // Hash the password with SHA256
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        console.log('Received user data:', newUser);

        const savedUser = await newUser.save();
        if (!savedUser) {
            return res.status(500).send('Failed to save user');
        }
        console.log('User registered:', savedUser);
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to register user. Please try again.');
    }
});

/// Login route - Inside the '/login' route in app.js
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }); // Find the user by username

        if (!user) {
            return res.status(404).send('Invalid username or password');
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); // Hash the provided password
        if (hashedPassword !== user.password) { // Compare hashed passwords
            return res.status(401).send('Invalid username or password');
        }

        // Redirect to home with username upon successful login
        res.status(200).json({ redirect: `home.html?username=${username}` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to login. Please try again.');
    }
});


mongoose.connect('mongodb://localhost:27017/projectusers')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(4000, () => {
            console.log('Server started on port 4000');
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

    


