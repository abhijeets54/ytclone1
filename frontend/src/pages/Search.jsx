import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import VideoCard from '../components/common/VideoCard';
import { videoService } from '../services/video.service';
import InfiniteScroll from 'react-infinite-scroll-component';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get('q');

  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    fetchVideos(1, true);
  }, [query]);

  const fetchVideos = async (pageNum = page, reset = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await videoService.searchVideos(query, pageNum);
      const newVideos = response.data;
      
      if (reset) {
        setVideos(newVideos);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
      }
      
      setHasMore(newVideos.length > 0);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error searching videos:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, mt: 8 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Search Results for "{query}"
      </Typography>

      <InfiniteScroll
        dataLength={videos.length}
        next={() => fetchVideos()}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <Grid container spacing={3}>
          {videos.map(video => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>

      {!loading && videos.length === 0 && (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No videos found
        </Typography>
      )}
    </Box>
  );
};

export default Search;
