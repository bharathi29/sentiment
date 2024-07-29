import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [review, setReview] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/reviews', { review });
      console.log('Review saved:', response.data);
      setReview('');
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sentiment Analysis for Incoming Calls on Helpdesk</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Enter your review"
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      </header>
    </div>
  );
}

export default App;
