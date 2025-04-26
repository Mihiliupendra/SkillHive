// src/services/commentService.js
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
    try {
      const response = await api.post(`/api/comments/${postId}`, { content });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Add a reply to a comment
  replyToComment: async (postId, parentCommentId, content) => {
    try {
      const response = await api.post(`/api/comments/${postId}/reply/${parentCommentId}`, { content });
      return response.data;
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  },

  // Edit a comment
  editComment: async (commentId, content) => {
    try {
      const response = await api.put(`/api/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/api/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};


