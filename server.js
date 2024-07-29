const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sentiment-analysis', { useNewUrlParser: true, useUnifiedTopology: true });

const reviewSchema = new mongoose.Schema({
  review: String
});

const Review = mongoose.model('Review', reviewSchema);

app.post('/api/reviews', async (req, res) => {
  const { review } = req.body;
  const newReview = new Review({ review });
  await newReview.save();
  res.json(newReview);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
