export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      LOGOUT: '/users/logout',
      REFRESH_TOKEN: '/users/refresh-token',
      CURRENT_USER: '/users/current-user'
    },
    VIDEOS: {
      LIST: '/videos',
      UPLOAD: '/videos',
      DETAIL: (id) => `/videos/${id}`,
      UPDATE: (id) => `/videos/${id}`,
      DELETE: (id) => `/videos/${id}`,
      TOGGLE_PUBLISH: (id) => `/videos/toggle/publish/${id}`,
      CHANNEL: (username) => `/videos/channel/${username}`,
      SEARCH: '/videos/search'
    },
    LIKES: {
      VIDEO: (id) => `/likes/toggle/v/${id}`,
      COMMENT: (id) => `/likes/toggle/c/${id}`,
      TWEET: (id) => `/likes/toggle/t/${id}`,
      LIKED_VIDEOS: '/likes/videos'
    },
    COMMENTS: {
      LIST: (videoId) => `/comments/${videoId}`,
      ADD: (videoId) => `/comments/${videoId}`,
      UPDATE: (commentId) => `/comments/c/${commentId}`,
      DELETE: (commentId) => `/comments/c/${commentId}`
    },
    PLAYLISTS: {
      CREATE: '/playlists',
      LIST: '/playlists',
      DETAIL: (id) => `/playlists/${id}`,
      UPDATE: (id) => `/playlists/${id}`,
      DELETE: (id) => `/playlists/${id}`,
      ADD_VIDEO: (videoId, playlistId) => `/playlists/add/${videoId}/${playlistId}`,
      REMOVE_VIDEO: (videoId, playlistId) => `/playlists/remove/${videoId}/${playlistId}`
    }
  };
  
  export const FILE_LIMITS = {
    VIDEO: {
      MAX_SIZE: 100 * 1024 * 1024, // 100MB
      ALLOWED_TYPES: ['video/mp4', 'video/webm']
    },
    IMAGE: {
      MAX_SIZE: 2 * 1024 * 1024, // 2MB
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    }
  };
  
  export const ITEMS_PER_PAGE = 12;
  
  export const SIDEBAR_WIDTH = 240;
  