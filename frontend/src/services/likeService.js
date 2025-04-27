import api from '../api/axios';

export const likeService = {
  // Like a post
  likePost: async (postId) => {
    try {
      const response = await api.post(`/api/likes/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  // Unlike a post
  unlikePost: async (postId) => {
    try {
      await api.delete(`/api/likes/${postId}`);
      return true;
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  },

  // Check if the current user has liked a post
  hasLiked: async (postId) => {
    try {
      const response = await api.get(`/api/likes/status/${postId}`);
      return response.data.liked;
    } catch (error) {
      console.error('Error checking like status:', error);
      throw error;
    }
  },

  // Get all likes for a post
  getPostLikes: async (postId) => {
    try {
      const response = await api.get(`/api/likes/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post likes:', error);
      throw error;
    }
  },

  // Get like count for a post
  getLikeCount: async (postId) => {
    try {
      const response = await api.get(`/api/likes/count/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching like count:', error);
      throw error;
    }
  }
};