// src/services/sampleVideos.service.js
const YOUTUBE_API_KEY = 'AIzaSyAWgkw2tXWM-b02wyu2OHS62njT-82yo_o'; // Your YouTube API key

export const sampleVideosService = {
  async getSampleVideos() {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=20&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      
      return data.items.map(video => ({
        _id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high.url,
        videoFile: `https://www.youtube.com/watch?v=${video.id}`,
        duration: video.contentDetails.duration,
        views: parseInt(video.statistics.viewCount),
        owner: {
          _id: video.snippet.channelId,
          username: video.snippet.channelTitle,
          fullName: video.snippet.channelTitle,
          avatar: `https://i.pravatar.cc/150?u=${video.snippet.channelId}` // Placeholder avatar
        },
        createdAt: video.snippet.publishedAt
      }));
    } catch (error) {
      console.error('Error fetching sample videos:', error);
      return [];
    }
  }
};
