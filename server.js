const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
const mongoURI = process.env.MONGO_URI;

console.log('MongoDB URI:', mongoURI);

if (!mongoURI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch((err) => console.error('MongoDB Atlas connection error:', err));

// Define the sentiment schema and model
const sentimentSchema = new mongoose.Schema({
  review: String,
  score: Number,
  label: String,
});

const Sentiment = mongoose.model('Sentiment', sentimentSchema);

// Endpoint to accept sentiment analysis data
app.post('/api/sentiment', async (req, res) => {
  try {
    const { review, score, label } = req.body;

    const newSentiment = new Sentiment({ review, score, label });

    // Save the sentiment data using async/await
    await newSentiment.save();

    res.status(200).send('Sentiment data saved successfully');
  } catch (err) {
    console.error('Error saving sentiment data:', err);
    res.status(500).send('Error saving sentiment data');
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
