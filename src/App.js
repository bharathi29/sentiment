import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [review, setReview] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/reviews', { review });
      console.log('Review submitted successfully:', response.data);
      setReview('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">
            <FontAwesomeIcon icon={faCommentDots} /> Sentiment Analysis
          </h1>
          <p className="app-description">
            Enter your review below
          </p>
          <form className="review-form" onSubmit={handleSubmit}>
            <textarea
              className="review-input"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Review / feedback here"
              required
            />
            <button className="submit-button" type="submit">
              Analyze Now <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
