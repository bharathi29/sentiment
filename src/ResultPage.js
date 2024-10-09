import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const { sentiment } = location.state || {};  // Get the sentiment data from the state

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">Sentiment Analysis Result</h1>

          {/* Display sentiment result */}
          {sentiment ? (
            <div className="sentiment-result">
              <p><strong>Sentiment Label:</strong> {sentiment.label}</p>
              <p><strong>Sentiment Score:</strong> {sentiment.score}</p>
            </div>
          ) : (
            <p>No sentiment data available.</p>
          )}

          {/* Link to go back to the home page */}
          <Link to="/" className="back-link">Analyze Another Review</Link>
        </div>
      </header>
    </div>
  );
}

export default ResultPage;
