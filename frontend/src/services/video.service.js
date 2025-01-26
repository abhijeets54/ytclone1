import api from '../utils/axios.config';

export const videoService = {
  getAllVideos: async (page = 1, limit = 12) => {
    const response = await api.get(`/videos?page=${page}&limit=${limit}`);
    return response.data;
  },

  getVideoById: async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  },

  uploadVideo: async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000 // Increase timeout for video uploads
    };
    return api.post('/videos', formData, config);
  },
  

  updateVideo: async (videoId, data) => {
    const response = await api.patch(`/videos/${videoId}`, data);
    return response.data;
  },

  deleteVideo: async (videoId) => {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  },

  togglePublishStatus: async (videoId) => {
    const response = await api.patch(`/videos/toggle/publish/${videoId}`);
    return response.data;
  },

  getChannelVideos: async (username) => {
    const response = await api.get(`/videos/channel/${username}`);
    return response.data;
  },

  searchVideos: async (query, page = 1) => {
    const response = await api.get(`/videos/search?q=${query}&page=${page}`);
    return response.data;
  }
};


