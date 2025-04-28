import React, { useState } from 'react';
import { Storage, API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import '../styles/VideoUpload.css';

const VideoUpload = ({ user }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Validate file type
    const fileType = selectedFile.type;
    if (!fileType.startsWith('video/')) {
      setError('Please select a valid video file.');
      return;
    }
    
    // Validate file size (limit to 500MB for example)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds the limit (500MB).`);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      
      // Generate a unique file name to avoid collisions
      const fileName = `${Date.now()}-${file.name}`;
      const key = `video_in/${fileName}`;
      
      // Upload the file to S3
      await Storage.put(key, file, {
        level: 'private',
        contentType: file.type,
        progressCallback: (progress) => {
          const progressPercentage = Math.round((progress.loaded / progress.total) * 100);
          setProgress(progressPercentage);
        },
      });
      
      // After successful upload, start the processing workflow
      // This is a placeholder for the actual API call to your Step Functions workflow
      try {
        // In a real implementation, you would call your API Gateway endpoint
        // that triggers the Step Functions workflow
        /*
        await API.post('videoProcessingApi', '/process', {
          body: {
            s3_uri: `s3://${process.env.REACT_APP_S3_BUCKET}/${key}`,
            user_id: user.username,
          }
        });
        */
        
        // For now, we'll just simulate a successful API call
        console.log('Processing workflow started for:', key);
        
        // Navigate to the status page
        navigate(`/status/${encodeURIComponent(key)}`);
      } catch (apiError) {
        console.error('Error starting processing workflow:', apiError);
        setError('Failed to start video processing. Please try again.');
        setUploading(false);
      }
    } catch (uploadError) {
      console.error('Error uploading file:', uploadError);
      setError('Failed to upload video. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="video-upload">
      <h2>Upload Video</h2>
      
      <div className="upload-container">
        <div className="file-input-container">
          <input
            type="file"
            id="video-file"
            onChange={handleFileChange}
            accept="video/*"
            disabled={uploading}
          />
          <label htmlFor="video-file" className={uploading ? 'disabled' : ''}>
            {file ? file.name : 'Select Video File'}
          </label>
        </div>
        
        {file && (
          <div className="file-details">
            <p><strong>File:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {file.type}</p>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {uploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <span>{progress}%</span>
          </div>
        )}
        
        <button 
          className="upload-button"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload and Process Video'}
        </button>
        
        <div className="upload-info">
          <h3>What happens after upload?</h3>
          <ol>
            <li>Your video will be uploaded to a secure Amazon S3 bucket.</li>
            <li>Our system will extract audio and video frames for processing.</li>
            <li>Audio will be transcribed and video frames will be analyzed.</li>
            <li>The content will be indexed for semantic search.</li>
            <li>You'll be able to search through your video using natural language.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;