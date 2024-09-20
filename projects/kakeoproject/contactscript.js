const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle form submission
app.post('/submit_contact_form', (req, res) => {
    const { name, phone, email, subject, message } = req.body;

    // Create a string with the form data
    const formData = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\n`;

    // Append the form data to a local text file
    fs.appendFile('kakeomessages.txt', formData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).json({ message: 'Failed to save form data' });
        } else {
            console.log('Form data saved successfully');
            res.status(200).json({ message: 'Form submitted successfully!' });
        }
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

