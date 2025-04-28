import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Storage, API } from 'aws-amplify';
import '../styles/VideoPlayer.css';

const VideoPlayer = () => {
  const { id } = useParams();
  const location = useLocation();
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Extract timestamp from URL query params if present
  const searchParams = new URLSearchParams(location.search);
  const startTime = searchParams.get('t');

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        
        // Get the video URL from S3
        const url = await Storage.get(decodeURIComponent(id), { level: 'private' });
        setVideoUrl(url);
        
        // In a real implementation, you would fetch the transcript from your backend
        // For now, we'll use mock data
        const mockTranscript = [
          { start: 0, end: 5, text: "Hello and welcome to our presentation.", speaker: "Speaker 1" },
          { start: 6, end: 10, text: "Today we'll be discussing the new product features.", speaker: "Speaker 1" },
          { start: 11, end: 15, text: "Let me show you how it works.", speaker: "Speaker 1" },
          { start: 16, end: 22, text: "This is the main dashboard where you can see all your analytics.", speaker: "Speaker 1" },
          { start: 23, end: 30, text: "Can you explain how the reporting feature works?", speaker: "Speaker 2" },
          { start: 31, end: 40, text: "Sure, the reporting feature allows you to generate custom reports based on your data.", speaker: "Speaker 1" },
          // Add more transcript segments as needed
        ];
        
        setTranscript(mockTranscript);
        setLoading(false);
        
        // If a start time was provided, seek to that position
        if (startTime && videoRef.current) {
          videoRef.current.currentTime = parseInt(startTime, 10);
          videoRef.current.play().catch(e => console.error('Error playing video:', e));
        }
        
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('Failed to load video. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchVideoData();
  }, [id, startTime]);

  // Function to handle clicking on a transcript segment
  const handleTranscriptClick = (startTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play().catch(e => console.error('Error playing video:', e));
    }
  };

  // Function to update active transcript segment based on current video time
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  
  const handleTimeUpdate = () => {
    if (videoRef.current && transcript.length > 0) {
      const currentTime = videoRef.current.currentTime;
      
      const index = transcript.findIndex(
        segment => currentTime >= segment.start && currentTime <= segment.end
      );
      
      if (index !== -1 && index !== activeSegmentIndex) {
        setActiveSegmentIndex(index);
        
        // Scroll the active segment into view
        const activeElement = document.getElementById(`transcript-segment-${index}`);
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading video...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="video-player-page">
      <h2>Video Player</h2>
      
      <div className="video-container">
        <video 
          ref={videoRef}
          controls
          onTimeUpdate={handleTimeUpdate}
          className="video-element"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="transcript-container">
        <h3>Transcript</h3>
        
        <div className="transcript-segments">
          {transcript.map((segment, index) => (
            <div 
              key={index}
              id={`transcript-segment-${index}`}
              className={`transcript-segment ${index === activeSegmentIndex ? 'active' : ''}`}
              onClick={() => handleTranscriptClick(segment.start)}
            >
              <div className="segment-header">
                <span className="segment-time">{formatTime(segment.start)}</span>
                <span className="segment-speaker">{segment.speaker}</span>
              </div>
              <p className="segment-text">{segment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to format time in MM:SS format
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default VideoPlayer;