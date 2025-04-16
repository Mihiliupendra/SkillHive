// src/pages/Connections.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Paper, Tabs, Tab, Avatar, Typography, CircularProgress, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

const Connections = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Use current user's ID if no userId is provided in URL
  const targetUserId = userId || currentUser?.id;

  const fetchConnections = async () => {
    if (!targetUserId) {
      setError('User not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all connections in parallel
      const [followersRes, followingRes, friendsRes] = await Promise.all([
        axios.get(`/api/users/${targetUserId}/followers`),
        axios.get(`/api/users/${targetUserId}/following`),
        axios.get(`/api/users/${targetUserId}/friends`)
      ]);

      setFollowers(Array.isArray(followersRes.data) ? followersRes.data : []);
      setFollowing(Array.isArray(followingRes.data) ? followingRes.data : []);
      setFriends(Array.isArray(friendsRes.data) ? friendsRes.data : []);
      
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError('Failed to load connections. Please try again later.');
      setFollowers([]);
      setFollowing([]);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [targetUserId]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const response = await axios.get(`/api/users/search?q=${encodeURIComponent(query)}`);
        setSearchResults(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error searching users:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderConnectionList = (connections = []) => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <CircularProgress style={{ color: '#F7931E' }} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      );
    }

    const displayList = searchQuery ? searchResults : connections;

    if (!Array.isArray(displayList) || displayList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'No users found' : 'No connections found'}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {displayList.map((user) => (
          <Link 
            to={`/profile/${user._id || user.id}`}
            key={user._id || user.id}
            className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <Avatar 
              src={user.profileImage} 
              className="w-12 h-12 border border-gray-200"
            >
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Avatar>
            <div className="ml-3 flex-grow">
              <Typography className="font-medium text-[#002B5B]">
                {user.username || `${user.firstName} ${user.lastName}`}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm">
                {user.firstName} {user.lastName}
              </Typography>
            </div>
            {user._id !== currentUser?.id && (
              <button 
                className={`px-4 py-1 text-sm rounded-full transition-colors ${
                  following.some(f => f._id === user._id)
                    ? 'border border-gray-300 bg-gray-100 text-gray-700'
                    : 'border border-[#002B5B] text-[#002B5B] hover:bg-[#002B5B]/5'
                }`}
              >
                {following.some(f => f._id === user._id) ? 'Following' : 'Follow'}
              </button>
            )}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 h-14">
          <Link to="/home">
            <IconButton size="small">
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <div className="ml-6">
            <Typography variant="h6" className="font-semibold">
              {currentUser?.username || 'Connections'}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {activeTab === 'followers' ? followers.length : 
               activeTab === 'following' ? following.length : 
               friends.length} {activeTab}
            </Typography>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="px-4 py-2 border-b border-gray-200 relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]"
          />
          {isSearching && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={20} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          className="border-b border-gray-200"
        >
          <Tab 
            value="followers" 
            label={`Followers ${followers?.length || 0}`}
            className="text-sm"
          />
          <Tab 
            value="following" 
            label={`Following ${following?.length || 0}`}
            className="text-sm"
          />
          <Tab 
            value="friends" 
            label={`Friends ${friends?.length || 0}`}
            className="text-sm"
          />
        </Tabs>
      </div>

      {/* Connection List */}
      <div className="pb-6">
        {activeTab === 'followers' && renderConnectionList(followers)}
        {activeTab === 'following' && renderConnectionList(following)}
        {activeTab === 'friends' && renderConnectionList(friends)}
      </div>
    </div>
  );
};

export default Connections;