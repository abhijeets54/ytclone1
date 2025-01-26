export const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    if (hours > 0) {
      return `${hours}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
    }
    return `${minutes}:${padZero(remainingSeconds)}`;
  };
  
  const padZero = (num) => {
    return num.toString().padStart(2, '0');
  };
  
  export const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };
  
  export const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
  
    if (years > 0) return `${years} year${years === 1 ? '' : 's'} ago`;
    if (months > 0) return `${months} month${months === 1 ? '' : 's'} ago`;
    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return 'Just now';
  };
  
  export const validateFile = (file, type) => {
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 2 * 1024 * 1024; // 100MB for video, 2MB for images
    const allowedTypes = type === 'video' 
      ? ['video/mp4', 'video/webm']
      : ['image/jpeg', 'image/png', 'image/webp'];
  
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
  
    if (file.size > maxSize) {
      throw new Error(`File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
    }
  
    return true;
  };
  