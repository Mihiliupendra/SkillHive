// src/services/communityService.js
import axios from '../api/axios';

const API_URL = '/api/v1/communities';
const FEED_POST_URL = '/api/v1/feed-posts';

export const CommunityService = {
  // Main community endpoint with all filtering capabilities
  getCommunities: (page = 0, size = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      size,
      ...filters
    });
    return axios.get(`${API_URL}?${params.toString()}`);
  },

  // Single community operations
  getCommunityById: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },

  createCommunity: (communityData) => {
    return axios.post(API_URL, communityData);
  },

  updateCommunity: (id, communityData) => {
    return axios.put(`${API_URL}/${id}`, communityData);
  },

  deleteCommunity: (id) => {
    return axios.delete(`${API_URL}/${id}`);
  },

  // Member management
  getCommunityMembers: (communityId) => {
    return axios.get(`${API_URL}/${communityId}/members`);
  },

  addMember: (communityId, userId) => {
    return axios.post(`${API_URL}/${communityId}/members/${userId}`);
  },

  removeMember: (communityId, userId) => {
    return axios.delete(`${API_URL}/${communityId}/members/${userId}`);
  },

  // Admin management
  getCommunityAdmins: (communityId) => {
    return axios.get(`${API_URL}/${communityId}/admins`);
  },

  addAdmin: (communityId, userId) => {
    return axios.post(`${API_URL}/${communityId}/admins/${userId}`);
  },

  removeAdmin: (communityId, userId) => {
    return axios.delete(`${API_URL}/${communityId}/admins/${userId}`);
  },

  // Convenience methods that use the main getCommunities endpoint
  getPublicCommunities: (page = 0, size = 10) => {
    return CommunityService.getCommunities(page, size, { visibility: 'public' });
  },

  getCommunitiesByCategory: (category, page = 0, size = 10) => {
    return CommunityService.getCommunities(page, size, { category });
  },

  getCommunitiesByTag: (tag, page = 0, size = 10) => {
    return CommunityService.getCommunities(page, size, { tag });
  },

  searchCommunitiesByName: (name, page = 0, size = 10) => {
    return CommunityService.getCommunities(page, size, { name });
  },

  getUserCommunities: (userId, page = 0, size = 10) => {
    return CommunityService.getCommunities(page, size, { memberId: userId });
  },

  getUserAdministeredCommunities: (userId, page = 0, size = 10) => {
    return CommunityService.getCommunities(page, size, { adminId: userId });
  },

  // Feed post endpoints
  getCommunityPosts: (communityId, page = 0, size = 10) => {
    return axios.get(`${FEED_POST_URL}/community/${communityId}?page=${page}&size=${size}`);
  },

  getUserPosts: (userId) => {
    return axios.get(`${FEED_POST_URL}/user/${userId}`);
  },

  createPost: (postData) => {
    return axios.post(FEED_POST_URL, postData);
  },

  addReaction: (postId, userId, emoji) => {
    return axios.post(`${FEED_POST_URL}/${postId}/reactions?userId=${userId}&emoji=${emoji}`);
  },

  removeReaction: (postId, userId) => {
    return axios.delete(`${FEED_POST_URL}/${postId}/reactions/${userId}`);
  }
};

export default CommunityService;