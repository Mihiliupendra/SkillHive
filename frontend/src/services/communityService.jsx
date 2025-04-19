// src/services/communityService.js
import axios from '../api/axios';

const API_URL = '/api';

export const CommunityService = {
  // Community endpoints
  getAllCommunities: () => {
    return axios.get(`${API_URL}/communities`);
  },
  
  getCommunityById: (id) => {
    return axios.get(`${API_URL}/communities/${id}`);
  },
  
  getUserCommunities: (userId) => {
    return axios.get(`${API_URL}/communities/member/${userId}`);
  },
  
  createCommunity: (communityData) => {
    return axios.post(`${API_URL}/communities`, communityData);
  },
  
  joinCommunity: (communityId, userId) => {
    return axios.post(`${API_URL}/communities/${communityId}/members/${userId}`);
  },
  
  leaveCommunity: (communityId, userId) => {
    return axios.delete(`${API_URL}/communities/${communityId}/members/${userId}`);
  },
  
  // Feed post endpoints
  getCommunityPosts: (communityId, page = 0, size = 10) => {
    return axios.get(`${API_URL}/feed-posts/community/${communityId}?page=${page}&size=${size}`);
  },
  
  getUserPosts: (userId) => {
    return axios.get(`${API_URL}/feed-posts/user/${userId}`);
  },
  
  createPost: (postData) => {
    return axios.post(`${API_URL}/feed-posts`, postData);
  },
  
  addReaction: (postId, userId, emoji) => {
    return axios.post(`${API_URL}/feed-posts/${postId}/reactions?userId=${userId}&emoji=${emoji}`);
  },
  
  removeReaction: (postId, userId) => {
    return axios.delete(`${API_URL}/feed-posts/${postId}/reactions/${userId}`);
  }
};

export default CommunityService;