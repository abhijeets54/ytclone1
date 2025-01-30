import api from '../utils/axios.config';

export const userService = {

  getChannelProfile: async (username) => {
    if (!username) {
      throw new Error('Username is required');
    }
    
    // Remove any potential whitespace and validate username
    const sanitizedUsername = username.trim();
    if (!sanitizedUsername || sanitizedUsername === 'undefined' || sanitizedUsername === 'null') {
      throw new Error('Invalid username');
    }

    const response = await api.get(`/users/c/${sanitizedUsername}`);
    return response.data;
  },

   getChannelProfile: async (username) => {
    const response = await api.get(`/users/c/${username}`);  // Changed from /c/ to /channel/
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/users/update-account', data);
    return response.data;
  },

  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.patch('/users/avatar', formData);
    return response.data;
  },

  updateCoverImage: async (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    const response = await api.patch('/users/cover-image', formData);
    return response.data;
  },

  getWatchHistory: async () => {
    const response = await api.get('/users/history');
    return response.data;
  }
};
