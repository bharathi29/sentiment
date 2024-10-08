import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [review, setReview] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponseMessage('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/sentiment', { review });
      setResponseMessage('Review submitted successfully! Sentiment analysis in progress.');
      console.log('Review submitted successfully:', response.data);
    } catch (error) {
      setResponseMessage('Failed to submit review. Please try again.');
      console.error('Error while submitting review:', error);
    } finally {
      setReview('');
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">
            <FontAwesomeIcon icon={faCommentDots} /> Sentiment Analysis
          </h1>
          <p className="app-description">Enter your review below:</p>

          {/* Form to input review */}
          <form className="review-form" onSubmit={handleSubmit}>
            <textarea
              className="review-input"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Type your review or feedback here"
              required
              disabled={loading}
            />
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Analyze Sentiment'} <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>

          {/* Feedback message */}
          {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
