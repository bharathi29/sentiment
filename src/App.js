import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ResultPage from './ResultPage';

function HomePage() {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/sentiment', { review });
      // Navigate to result page and pass sentiment data and review text via state
      navigate('/result', { state: { sentiment: response.data, review } });
    } catch (error) {
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
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
