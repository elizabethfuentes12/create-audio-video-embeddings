import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { Link } from 'react-router-dom';
import '../styles/VideoSearch.css';

const VideoSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      
      // This is a placeholder for the actual API call
      // In a real implementation, you would call your API Gateway endpoint
      // that connects to your Aurora PostgreSQL database with pgvector
      
      /*
      const response = await API.post('videoProcessingApi', '/search', {
        body: {
          query: query,
          limit: 20,
          threshold: 0.7
        }
      });
      setResults(response.results);
      */
      
      // For now, we'll simulate a response with mock data
      setTimeout(() => {
        const mockResults = [
          {
            id: 'result-1',
            videoId: 'video-1',
            videoName: 'Company Meeting Q1 2023.mp4',
            timestamp: 125, // seconds
            text: 'We need to focus on improving our customer satisfaction metrics this quarter.',
            similarity: 0.92,
            type: 'text',
            speaker: 'John Smith',
          },
          {
            id: 'result-2',
            videoId: 'video-1',
            videoName: 'Company Meeting Q1 2023.mp4',
            timestamp: 347, // seconds
            text: 'The customer feedback from our latest survey shows areas for improvement.',
            similarity: 0.87,
            type: 'text',
            speaker: 'Sarah Johnson',
          },
          {
            id: 'result-3',
            videoId: 'video-2',
            videoName: 'Product Demo v2.0.mp4',
            timestamp: 78, // seconds
            text: 'This new feature was designed based on customer requests and feedback.',
            similarity: 0.81,
            type: 'text',
            speaker: 'Mike Davis',
          },
          {
            id: 'result-4',
            videoId: 'video-3',
            videoName: 'Team Brainstorming Session.mp4',
            timestamp: 512, // seconds
            frameUrl: 'https://example.com/frame123.jpg',
            similarity: 0.79,
            type: 'image',
          },
        ];
        
        setResults(mockResults);
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error('Error searching videos:', err);
      setError('Failed to perform search. Please try again later.');
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-search">
      <h2>Search Video Content</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for moments in your videos..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching through video content...</p>
        </div>
      )}
      
      {!loading && searched && results.length === 0 && (
        <div className="no-results">
          <p>No results found for "{query}"</p>
          <p>Try using different keywords or phrases.</p>
        </div>
      )}
      
      {!loading && results.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          
          <div className="results-list">
            {results.map((result) => (
              <div key={result.id} className="result-item">
                <div className="result-header">
                  <span className="video-name">{result.videoName}</span>
                  <span className="timestamp">{formatTime(result.timestamp)}</span>
                  <span className="similarity">{Math.round(result.similarity * 100)}% match</span>
                </div>
                
                {result.type === 'text' && (
                  <div className="result-content text-content">
                    <p className="transcript-text">{result.text}</p>
                    {result.speaker && <p className="speaker">Speaker: {result.speaker}</p>}
                  </div>
                )}
                
                {result.type === 'image' && (
                  <div className="result-content image-content">
                    <div className="frame-thumbnail">
                      <img src={result.frameUrl} alt="Video frame" />
                    </div>
                  </div>
                )}
                
                <div className="result-actions">
                  <Link 
                    to={`/video/${encodeURIComponent(result.videoId)}?t=${result.timestamp}`} 
                    className="action-button"
                  >
                    Watch at this moment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="search-tips">
        <h3>Search Tips</h3>
        <ul>
          <li>Use natural language queries like "discussion about budget concerns"</li>
          <li>Try specific phrases that might be mentioned in the video</li>
          <li>Search for concepts rather than just keywords</li>
          <li>Results include both spoken content and visual elements</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoSearch;