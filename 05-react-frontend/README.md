# Video Processing Frontend

This React application serves as a frontend interface for the Audio/Video Processing Pipeline with Vector Search backend. It allows users to upload videos, monitor processing status, and search through video content using natural language queries.

## Features

- **Secure Authentication**: User management through Amazon Cognito
- **Video Upload**: Interface to upload videos to the S3 bucket
- **Processing Status**: Monitoring of the Step Functions workflow
- **Search Interface**: Natural language search across video content
- **Results Visualization**: Display of search results with timestamps and video playback

## Prerequisites

Before setting up this frontend application, ensure you have:

1. Deployed the backend infrastructure (ECS cluster, Aurora PostgreSQL, and Step Functions workflow)
2. Set up an AWS account with appropriate permissions
3. Installed Node.js (v14 or later) and npm
4. Installed the AWS Amplify CLI (`npm install -g @aws-amplify/cli`)

## Step-by-Step Setup Guide

### 1. Configure AWS Amplify

First, configure the Amplify CLI with your AWS credentials:

```bash
amplify configure
```

Follow the prompts to create an IAM user with appropriate permissions.

### 2. Initialize Amplify in the Project

Navigate to the project directory and initialize Amplify:

```bash
cd amplify-frontend
amplify init
```

Follow the prompts to set up your project. When asked about the authentication method, choose "AWS profile" and select the profile you created in the previous step.

### 3. Add Authentication

Add authentication to your project:

```bash
amplify add auth
```

Select the following options:
- Default configuration with Social Provider (Federation)
- Email for the sign-in
- Enable MFA (Multi-Factor Authentication)
- Email verification

### 4. Add Storage for Video Files

Add storage for video uploads:

```bash
amplify add storage
```

Select the following options:
- Content (Images, audio, video, etc.)
- Auth and guest access
- Create a new S3 bucket or use the existing one from the backend

### 5. Add API for Backend Communication

Add an API to communicate with the backend:

```bash
amplify add api
```

Select the following options:
- REST API
- CRUD functions with Amazon DynamoDB or connect to existing resources

### 6. Push Configuration to AWS

Deploy the resources to AWS:

```bash
amplify push
```

### 7. Configure Environment Variables

Create a `.env` file in the root directory based on the `.env.example` file:

```bash
cp .env.example .env
```

Update the values in the `.env` file with your specific configuration.

### 8. Install Dependencies and Start the Application

Install the project dependencies and start the development server:

```bash
npm install
npm start
```

The application should now be running at http://localhost:3000.

## Security Considerations

### Authentication Security

This application implements secure user authentication using Amazon Cognito, which provides:

- **User Sign-up and Sign-in**: Secure user registration and login flows
- **Multi-factor Authentication (MFA)**: Additional security layer for user accounts
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

## Deployment

### Deploying with Amplify Console

1. Push your code to a Git repository (GitHub, GitLab, BitBucket, etc.)
2. Go to the AWS Amplify Console in the AWS Management Console
3. Choose "Connect app" and select your repository
4. Follow the steps to configure the build settings
5. Deploy the application

### Manual Deployment

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `build` directory, which you can deploy to any static hosting service.

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