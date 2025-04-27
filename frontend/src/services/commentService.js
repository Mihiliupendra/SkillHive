import api from '../api/axios';

export const commentService = {
  // Get all comments for a post with pagination
  getComments: async (postId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/comments/${postId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a new comment to a post
  addComment: async (postId, content) => {
    const commentDTO = {
      postId,
      content
    };
    try {
      const response = await api.post('/api/comments', commentDTO);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Add a reply to a comment
  replyToComment: async (parentCommentId, replyDTO) => {
    try {
      const response = await api.post(`/api/comments/reply/${parentCommentId}`, replyDTO);
      return response.data;
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  },

  // Edit a comment
  editComment: async (commentId, commentDTO) => {
    try {
      const response = await api.put(`/api/comments/${commentId}`, commentDTO);
      return response.data;
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Get comment count for a post
  getCommentCount: async (postId) => {
    try {
      const response = await api.get(`/api/comments/count/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comment count:', error);
      throw error;
    }
  }
};