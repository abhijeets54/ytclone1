import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
  page: 1,
  hasMore: true
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    appendVideos: (state, action) => {
      state.videos = [...state.videos, ...action.payload];
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    toggleVideoLike: (state, action) => {
      const videoId = action.payload;
      if (state.currentVideo?._id === videoId) {
        state.currentVideo.isLiked = !state.currentVideo.isLiked;
        state.currentVideo.likes = state.currentVideo.isLiked 
          ? state.currentVideo.likes + 1 
          : state.currentVideo.likes - 1;
      }
    }
  }
});

export const {
  setVideos,
  appendVideos,
  setCurrentVideo,
  setLoading,
  setError,
  setPage,
  setHasMore,
  toggleVideoLike
} = videoSlice.actions;

export default videoSlice.reducer;
