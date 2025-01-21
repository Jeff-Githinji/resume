import express from 'express';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv'; 
import path from 'path'; // Import path for resolving directory paths
import Url from './models/url.js';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the frontend directory
app.use(express.static(path.join(process.cwd(), 'frontend'))); // Use process.cwd() to get the root directory

app.use(express.json()); // To handle JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Route to shorten a URL
app.post('/shorten', async (req, res) => {
  const { originalUrl, customUrl } = req.body;
  let shortUrl;

  if (customUrl) {
    // Check if the custom URL is already in use
    const existingUrl = await Url.findOne({ shortUrl: customUrl });
    if (existingUrl) {
      return res.status(400).json("Custom URL is already in use.");
    }
    shortUrl = customUrl; // Use the custom URL provided by the user
  } else {
    shortUrl = nanoid(8); // Generate a unique 8-character code
  }

  try {
    // Save the URL in the database
    const url = new Url({ originalUrl, shortUrl });
    await url.save();

    res.json({ originalUrl, shortUrl: `${req.headers.host}/${shortUrl}` });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});


// Route to redirect to the original URL
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl });

    if (url) {
      url.clicks++; // Increment click count (optional)
      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json("URL not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});


// Route to get analytics for a specific short URL
app.get('/analytics/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await Url.findOne({ shortUrl });

    if (url) {
      return res.json({
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        clicks: url.clicks,
      });
    } else {
      return res.status(404).json("URL not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});



  