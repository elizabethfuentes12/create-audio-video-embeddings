import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Dashboard from './components/Dashboard';
import VideoUpload from './components/VideoUpload';
import VideoSearch from './components/VideoSearch';
import VideoPlayer from './components/VideoPlayer';
import Navigation from './components/Navigation';
import ProcessingStatus from './components/ProcessingStatus';

// Import AWS configuration
// import awsExports from './aws-exports';
// Amplify.configure(awsExports);

// Temporary configuration - Replace with aws-exports.js after amplify init
Amplify.configure({
  // This is a placeholder. After running 'amplify init' and 'amplify push',
  // replace this with the generated aws-exports.js import
  Auth: {
    region: process.env.REACT_APP_REGION || 'us-east-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
  Storage: {
    region: process.env.REACT_APP_REGION || 'us-east-1',
    bucket: process.env.REACT_APP_S3_BUCKET,
  },
  API: {
    endpoints: [
      {
        name: 'videoProcessingApi',
        endpoint: process.env.REACT_APP_API_ENDPOINT,
      },
    ],
  },
});

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="app-container">
            <Navigation user={user} signOut={signOut} />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/upload" element={<VideoUpload user={user} />} />
                <Route path="/search" element={<VideoSearch user={user} />} />
                <Route path="/video/:id" element={<VideoPlayer />} />
                <Route path="/status/:id" element={<ProcessingStatus />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;