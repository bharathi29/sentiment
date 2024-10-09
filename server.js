const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
require('dotenv').config();

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
  const { review } = req.body;

  // Execute Python script and pass the review as an argument
  exec(`python3 sentiment_analysis.py "${review}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing Python script:', error);
      return res.status(500).send('Error executing sentiment analysis');
    }

    try {
      // Parse the JSON output from Python
      const sentimentResult = JSON.parse(stdout);

      // Save the sentiment data in MongoDB
      const newSentiment = new Sentiment({
        review,
        score: sentimentResult.score,
        label: sentimentResult.label,
      });

      newSentiment.save()
        .then(() => res.status(200).json(sentimentResult))
        .catch((err) => {
          console.error('Error saving sentiment data:', err);
          res.status(500).send('Error saving sentiment data');
        });
    } catch (err) {
      console.error('Error parsing Python output:', err);
      res.status(500).send('Error parsing sentiment analysis result');
    }
  });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
