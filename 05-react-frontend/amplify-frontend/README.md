# Video Processing and Search Frontend

This React application serves as a frontend interface for the Audio/Video Processing Pipeline with Vector Search backend. It allows users to upload videos, monitor processing status, and search through video content using natural language queries.

## Architecture Overview

This application integrates with the existing AWS infrastructure that processes video content and makes it searchable using natural language. The frontend provides:

1. **Secure Authentication**: User management through Amazon Cognito
2. **Video Upload**: Interface to upload videos to the S3 bucket
3. **Processing Status**: Monitoring of the Step Functions workflow
4. **Search Interface**: Natural language search across video content
5. **Results Visualization**: Display of search results with timestamps and video playback

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- AWS Account with appropriate permissions
- Backend infrastructure deployed (ECS cluster, Aurora PostgreSQL, and Step Functions workflow)

## Step-by-Step Setup Guide

### 1. Install Dependencies

```bash
# Install project dependencies
npm install

# Install AWS Amplify libraries
npm install aws-amplify @aws-amplify/ui-react
```

### 2. Initialize Amplify

```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in the project
amplify init
```

Follow the prompts to set up your Amplify project.

### 3. Add Authentication

```bash
# Add authentication to your project
amplify add auth
```

Select the following options:
- Default configuration with Social Provider (Federation)
- Email for the sign-in
- Enable MFA (Multi-Factor Authentication)
- Email verification

### 4. Add Storage for Video Files

```bash
# Add storage for video uploads
amplify add storage
```

Select the following options:
- Content (Images, audio, video, etc.)
- Auth and guest access
- Create a new S3 bucket or use the existing one from the backend

### 5. Add API for Backend Communication

```bash
# Add API to communicate with the backend
amplify add api
```

Select the following options:
- REST API
- CRUD functions with Amazon DynamoDB or connect to existing resources

### 6. Push Configuration to AWS

```bash
# Deploy resources to AWS
amplify push
```

### 7. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_REGION=us-east-1
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_WEB_CLIENT_ID=your-web-client-id
REACT_APP_IDENTITY_POOL_ID=your-identity-pool-id
REACT_APP_S3_BUCKET=your-video-bucket
REACT_APP_STEP_FUNCTION_ARN=your-step-function-arn
```

## Security Features

### Authentication with Amazon Cognito

This application implements secure user authentication using Amazon Cognito, which provides:

- **User Sign-up and Sign-in**: Secure user registration and login flows
- **Multi-factor Authentication (MFA)**: Additional security layer for user accounts
- **OAuth Integration**: Support for social identity providers (Google, Facebook, etc.)
- **JWT Token Handling**: Secure token-based authentication
- **Authorization**: Fine-grained access control to AWS resources

### Secure API Access

- **IAM Authorization**: API requests are authorized using IAM roles
- **Temporary Credentials**: Using AWS Security Token Service (STS) for temporary credentials
- **HTTPS Encryption**: All API communications are encrypted using HTTPS

### Data Protection

- **Client-side Encryption**: Videos are encrypted before upload
- **S3 Bucket Policies**: Restricted access to uploaded content
- **CORS Configuration**: Proper Cross-Origin Resource Sharing settings

## Application Features

1. **User Authentication**
   - Sign up, sign in, and password recovery
   - Multi-factor authentication
   - User profile management

2. **Video Management**
   - Upload videos to S3
   - List uploaded videos
   - Delete videos

3. **Video Processing**
   - Trigger processing workflows
   - Monitor processing status
   - View processing results

4. **Search Functionality**
   - Natural language search across video content
   - Filter by time ranges, speakers, or topics
   - Semantic similarity search

5. **Results Visualization**
   - Display search results with timestamps
   - Video playback from specific timestamps
   - Transcript display with highlighted search terms

## Development Workflow

### Running Locally

```bash
# Start the development server
npm start
```

### Building for Production

```bash
# Create a production build
npm run build
```

### Deploying with Amplify

```bash
# Deploy the application
amplify publish
```

## Integration with Backend Services

This frontend application integrates with the following backend services:

1. **Amazon S3**: For video storage and retrieval
2. **AWS Step Functions**: For orchestrating the video processing workflow
3. **Amazon Aurora PostgreSQL**: For storing and querying vector embeddings
4. **Amazon Cognito**: For user authentication and authorization

## Troubleshooting

- **Authentication Issues**: Verify Cognito user pool settings and client IDs
- **Upload Problems**: Check S3 bucket permissions and CORS configuration
- **API Errors**: Verify API Gateway endpoints and IAM permissions
- **Search Not Working**: Ensure Aurora PostgreSQL connection and query permissions

## Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS Step Functions Documentation](https://docs.aws.amazon.com/step-functions/)