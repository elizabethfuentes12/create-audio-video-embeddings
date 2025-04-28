import React, { useState, useEffect } from 'react';
import { Storage, API } from 'aws-amplify';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      // This is a placeholder for the actual API call
      // In a real implementation, you would fetch the user's videos from your backend
      // For now, we'll list objects from the S3 bucket as an example
      
      const result = await Storage.list('', { level: 'private' });
      
      // Filter for video files only
      const videoFiles = result.filter(item => {
        const extension = item.key.split('.').pop().toLowerCase();
        return ['mp4', 'mov', 'avi', 'wmv'].includes(extension);
      });
      
      // Get additional metadata for each video
      const videosWithMetadata = await Promise.all(
        videoFiles.map(async (video) => {
          // In a real implementation, you would fetch processing status and other metadata
          // from your backend API or DynamoDB
          return {
            id: video.key,
            name: video.key.split('/').pop(),
            uploadDate: new Date(video.lastModified).toLocaleDateString(),
            status: 'Completed', // Placeholder - would come from backend
            url: await Storage.get(video.key, { level: 'private' }),
          };
        })
      );
      
      setVideos(videosWithMetadata);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your videos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your Videos</h2>
        <Link to="/upload" className="upload-button">Upload New Video</Link>
      </div>
      
      {videos.length === 0 ? (
        <div className="no-videos">
          <p>You haven't uploaded any videos yet.</p>
          <Link to="/upload" className="upload-link">Upload your first video</Link>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-thumbnail">
                {/* Placeholder thumbnail - in a real app, you'd generate or fetch thumbnails */}
                <div className="thumbnail-placeholder"></div>
              </div>
              <div className="video-info">
                <h3>{video.name}</h3>
                <p>Uploaded: {video.uploadDate}</p>
                <p className={`status status-${video.status.toLowerCase()}`}>
                  Status: {video.status}
                </p>
                <div className="video-actions">
                  <Link to={`/video/${encodeURIComponent(video.id)}`} className="action-button">
                    View
                  </Link>
                  <Link to={`/status/${encodeURIComponent(video.id)}`} className="action-button">
                    Processing Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;