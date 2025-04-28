import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from 'aws-amplify';
import '../styles/ProcessingStatus.css';

const ProcessingStatus = () => {
  const { id } = useParams();
  const [status, setStatus] = useState({
    overall: 'RUNNING',
    videoProcessing: 'COMPLETED',
    audioProcessing: 'RUNNING',
    transcription: 'RUNNING',
    embedding: 'PENDING',
    database: 'PENDING',
  });
  const [executionDetails, setExecutionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(10); // seconds
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchStatus();
    
    // Set up polling for status updates
    const intervalId = setInterval(() => {
      fetchStatus();
      setLastUpdated(new Date());
    }, refreshInterval * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [id, refreshInterval]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      
      // This is a placeholder for the actual API call
      // In a real implementation, you would call your API Gateway endpoint
      // that checks the Step Functions execution status
      
      /*
      const response = await API.get('videoProcessingApi', `/status/${encodeURIComponent(id)}`);
      setStatus(response.status);
      setExecutionDetails(response.executionDetails);
      */
      
      // For now, we'll simulate a response with mock data
      // In a real app, this would come from your Step Functions execution history
      
      // Simulate progress over time
      setTimeout(() => {
        const mockStatus = {
          overall: 'RUNNING',
          videoProcessing: 'COMPLETED',
          audioProcessing: 'COMPLETED',
          transcription: Math.random() > 0.5 ? 'COMPLETED' : 'RUNNING',
          embedding: Math.random() > 0.7 ? 'RUNNING' : 'PENDING',
          database: 'PENDING',
        };
        
        // Update overall status based on individual statuses
        if (Object.values(mockStatus).every(s => s === 'COMPLETED')) {
          mockStatus.overall = 'COMPLETED';
        } else if (Object.values(mockStatus).some(s => s === 'FAILED')) {
          mockStatus.overall = 'FAILED';
        }
        
        const mockExecutionDetails = {
          executionArn: 'arn:aws:states:us-east-1:123456789012:execution:VideoProcessingWorkflow:abc123',
          startDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          videoFile: decodeURIComponent(id),
          steps: [
            {
              name: 'Extract Video Frames',
              status: 'COMPLETED',
              startTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
              endTime: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
              details: 'Extracted 120 frames from video'
            },
            {
              name: 'Transcribe Audio',
              status: mockStatus.transcription,
              startTime: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
              endTime: mockStatus.transcription === 'COMPLETED' ? new Date(Date.now() - 1000 * 60 * 2).toISOString() : null,
              details: 'Processing audio transcription'
            },
            {
              name: 'Generate Embeddings',
              status: mockStatus.embedding,
              startTime: mockStatus.embedding !== 'PENDING' ? new Date(Date.now() - 1000 * 60 * 2).toISOString() : null,
              endTime: null,
              details: 'Creating vector embeddings for search'
            },
            {
              name: 'Store in Database',
              status: mockStatus.database,
              startTime: null,
              endTime: null,
              details: 'Storing vectors in Aurora PostgreSQL'
            }
          ]
        };
        
        setStatus(mockStatus);
        setExecutionDetails(mockExecutionDetails);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error('Error fetching processing status:', err);
      setError('Failed to load processing status. Please try again later.');
      setLoading(false);
    }
  };

  const handleRefreshChange = (e) => {
    setRefreshInterval(parseInt(e.target.value, 10));
  };

  const getStatusClass = (statusValue) => {
    switch (statusValue) {
      case 'COMPLETED':
        return 'status-completed';
      case 'RUNNING':
        return 'status-running';
      case 'FAILED':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  };

  if (loading && !status) {
    return <div className="loading">Loading processing status...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="processing-status">
      <h2>Processing Status</h2>
      
      <div className="status-header">
        <div className="file-info">
          <h3>File: {decodeURIComponent(id).split('/').pop()}</h3>
        </div>
        
        <div className="overall-status">
          <span className={`status-badge ${getStatusClass(status.overall)}`}>
            {status.overall}
          </span>
        </div>
      </div>
      
      <div className="status-details">
        <div className="status-progress">
          <h3>Processing Progress</h3>
          
          <div className="progress-steps">
            <div className={`progress-step ${getStatusClass(status.videoProcessing)}`}>
              <div className="step-icon"></div>
              <div className="step-label">Video Processing</div>
              <div className="step-status">{status.videoProcessing}</div>
            </div>
            
            <div className={`progress-step ${getStatusClass(status.audioProcessing)}`}>
              <div className="step-icon"></div>
              <div className="step-label">Audio Processing</div>
              <div className="step-status">{status.audioProcessing}</div>
            </div>
            
            <div className={`progress-step ${getStatusClass(status.transcription)}`}>
              <div className="step-icon"></div>
              <div className="step-label">Transcription</div>
              <div className="step-status">{status.transcription}</div>
            </div>
            
            <div className={`progress-step ${getStatusClass(status.embedding)}`}>
              <div className="step-icon"></div>
              <div className="step-label">Embedding Generation</div>
              <div className="step-status">{status.embedding}</div>
            </div>
            
            <div className={`progress-step ${getStatusClass(status.database)}`}>
              <div className="step-icon"></div>
              <div className="step-label">Database Storage</div>
              <div className="step-status">{status.database}</div>
            </div>
          </div>
        </div>
        
        {executionDetails && (
          <div className="execution-details">
            <h3>Execution Details</h3>
            
            <div className="details-table">
              <div className="details-row">
                <div className="details-label">Execution ID:</div>
                <div className="details-value">{executionDetails.executionArn.split(':').pop()}</div>
              </div>
              
              <div className="details-row">
                <div className="details-label">Started:</div>
                <div className="details-value">
                  {new Date(executionDetails.startDate).toLocaleString()}
                </div>
              </div>
              
              <div className="details-row">
                <div className="details-label">Duration:</div>
                <div className="details-value">
                  {formatDuration(new Date() - new Date(executionDetails.startDate))}
                </div>
              </div>
            </div>
            
            <h4>Step Details</h4>
            <div className="step-details">
              {executionDetails.steps.map((step, index) => (
                <div key={index} className={`step-detail ${getStatusClass(step.status)}`}>
                  <div className="step-name">{step.name}</div>
                  <div className="step-timing">
                    {step.startTime ? (
                      <>
                        Started: {new Date(step.startTime).toLocaleTimeString()}
                        {step.endTime && (
                          <> | Duration: {formatDuration(new Date(step.endTime) - new Date(step.startTime))}</>
                        )}
                      </>
                    ) : (
                      'Pending'
                    )}
                  </div>
                  <div className="step-info">{step.details}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="status-footer">
        <div className="refresh-controls">
          <label htmlFor="refresh-interval">Auto-refresh every:</label>
          <select 
            id="refresh-interval" 
            value={refreshInterval} 
            onChange={handleRefreshChange}
          >
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
          </select>
          <button onClick={fetchStatus} className="refresh-button">
            Refresh Now
          </button>
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="status-actions">
          {status.overall === 'COMPLETED' && (
            <Link to={`/video/${id}`} className="action-button">
              View Video
            </Link>
          )}
          
          {status.overall === 'COMPLETED' && (
            <Link to="/search" className="action-button">
              Search Content
            </Link>
          )}
          
          <Link to="/" className="action-button secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper function to format duration
const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export default ProcessingStatus;