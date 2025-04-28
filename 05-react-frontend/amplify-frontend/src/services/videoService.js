import { API, Storage } from 'aws-amplify';

/**
 * Service for interacting with video processing backend
 */
class VideoService {
  /**
   * Upload a video file to S3 and start processing
   * @param {File} file - The video file to upload
   * @param {Function} progressCallback - Callback for upload progress
   * @returns {Promise<Object>} - Processing information
   */
  async uploadAndProcess(file, progressCallback) {
    try {
      // Generate a unique file name
      const fileName = `${Date.now()}-${file.name}`;
      const key = `video_in/${fileName}`;
      
      // Upload the file to S3
      await Storage.put(key, file, {
        level: 'private',
        contentType: file.type,
        progressCallback,
      });
      
      // Start the processing workflow
      const response = await API.post('videoProcessingApi', '/process', {
        body: {
          s3_uri: `s3://${process.env.REACT_APP_S3_BUCKET}/${key}`,
        }
      });
      
      return {
        key,
        executionArn: response.executionArn,
        status: 'STARTED',
      };
    } catch (error) {
      console.error('Error in uploadAndProcess:', error);
      throw error;
    }
  }
  
  /**
   * Get the status of a video processing workflow
   * @param {string} videoKey - The S3 key of the video
   * @returns {Promise<Object>} - Status information
   */
  async getProcessingStatus(videoKey) {
    try {
      const response = await API.get('videoProcessingApi', `/status/${encodeURIComponent(videoKey)}`);
      return response;
    } catch (error) {
      console.error('Error in getProcessingStatus:', error);
      throw error;
    }
  }
  
  /**
   * Get a list of the user's videos
   * @returns {Promise<Array>} - List of videos
   */
  async listVideos() {
    try {
      // List objects from S3
      const result = await Storage.list('', { level: 'private' });
      
      // Filter for video files only
      const videoFiles = result.filter(item => {
        const extension = item.key.split('.').pop().toLowerCase();
        return ['mp4', 'mov', 'avi', 'wmv'].includes(extension);
      });
      
      // Get additional metadata for each video
      const videosWithMetadata = await Promise.all(
        videoFiles.map(async (video) => {
          try {
            // Try to get processing status from API
            const status = await this.getProcessingStatus(video.key).catch(() => ({
              status: { overall: 'UNKNOWN' }
            }));
            
            return {
              id: video.key,
              name: video.key.split('/').pop(),
              uploadDate: new Date(video.lastModified).toLocaleDateString(),
              status: status.status.overall || 'UNKNOWN',
              url: await Storage.get(video.key, { level: 'private' }),
            };
          } catch (err) {
            console.error(`Error getting metadata for video ${video.key}:`, err);
            return {
              id: video.key,
              name: video.key.split('/').pop(),
              uploadDate: new Date(video.lastModified).toLocaleDateString(),
              status: 'UNKNOWN',
              url: await Storage.get(video.key, { level: 'private' }),
            };
          }
        })
      );
      
      return videosWithMetadata;
    } catch (error) {
      console.error('Error in listVideos:', error);
      throw error;
    }
  }
  
  /**
   * Search for content within videos
   * @param {string} query - The search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Search results
   */
  async searchContent(query, options = {}) {
    try {
      const response = await API.post('videoProcessingApi', '/search', {
        body: {
          query,
          limit: options.limit || 20,
          threshold: options.threshold || 0.7,
        }
      });
      
      return response.results;
    } catch (error) {
      console.error('Error in searchContent:', error);
      throw error;
    }
  }
  
  /**
   * Get transcript for a video
   * @param {string} videoKey - The S3 key of the video
   * @returns {Promise<Array>} - Transcript segments
   */
  async getTranscript(videoKey) {
    try {
      const response = await API.get('videoProcessingApi', `/transcript/${encodeURIComponent(videoKey)}`);
      return response.transcript;
    } catch (error) {
      console.error('Error in getTranscript:', error);
      throw error;
    }
  }
}

export default new VideoService();