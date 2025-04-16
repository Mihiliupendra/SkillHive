// src/pages/Connections.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { userService } from '../api/userService';
import { Paper, Tabs, Tab, Avatar, Typography, CircularProgress, IconButton, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

const Connections = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Use current user's ID if no userId is provided in URL
  const targetUserId = userId || currentUser?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchConnections();
    }
  }, [targetUserId]);

  const transformUser = (user) => {
    if (!user) return null;
    return {
      id: user._id || user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profilePicture: user.profilePicture || '/images/Default Profile Pic.png',
      professionalHeader: user.professionalHeader || 'SkillHive Member',
      username: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'
    };
  };

  const fetchConnections = async () => {
    if (!targetUserId) {
      setError('User not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all connections in parallel
      const [followersRes, followingRes, friendsRes] = await Promise.all([
        axios.get(`/api/users/${targetUserId}/followers`),
        axios.get(`/api/users/${targetUserId}/following`),
        axios.get(`/api/users/${targetUserId}/friends`)
      ]);

      // Safely transform the data, handling potential null or undefined values
      const transformData = (response) => {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : 
                    response.data.content ? response.data.content : [];
        return data.map(user => transformUser(user)).filter(Boolean);
      };

      setFollowers(transformData(followersRes));
      setFollowing(transformData(followingRes));
      setFriends(transformData(friendsRes));

      // Fetch friend requests if viewing own profile
      if (targetUserId === currentUser?.id) {
        try {
          console.log('Fetching friend requests for user:', targetUserId);
          const requests = await userService.getPendingReceivedFriendRequests(targetUserId);
          console.log('Raw friend requests:', requests);
          
          const transformedRequests = Array.isArray(requests) ? requests.map(request => {
            console.log('Processing request:', request);
            return {
              ...request,
              _id: request.id || request._id, // Ensure we have _id
              sender: transformUser(request.sender)
            };
          }).filter(req => req.sender) : [];
          
          console.log('Transformed friend requests:', transformedRequests);
          setFriendRequests(transformedRequests);
        } catch (err) {
          console.error('Error fetching friend requests:', err);
          setFriendRequests([]);
        }
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load connections';
      setError(`${errorMessage}. Please try again later.`);
      setFollowers([]);
      setFollowing([]);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    if (!requestId) {
      console.error('No request ID provided');
      return;
    }
    
    try {
      setActionLoading(requestId);
      console.log('Accepting friend request with ID:', requestId);
      
      // Find the request object to get full details
      const request = friendRequests.find(req => req._id === requestId);
      if (!request) {
        console.error('Friend request not found:', requestId);
        return;
      }
      
      // Accept the friend request
      await userService.acceptFriendRequest(requestId);
      console.log('Successfully accepted friend request:', requestId);
      
      // Remove the request from the list immediately
      setFriendRequests(prev => prev.filter(req => req._id !== requestId));
      
      // Refresh the friends list
      const friendsRes = await axios.get(`/api/users/${targetUserId}/friends`);
      const transformedFriends = transformData(friendsRes);
      setFriends(transformedFriends);
      
      // Clear any existing errors
      setError(null);
      
    } catch (err) {
      console.error('Error accepting friend request:', err);
      const errorMessage = err.response?.data?.message || 'Failed to accept friend request';
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    if (!requestId) {
      console.error('No request ID provided');
      return;
    }

    try {
      setActionLoading(requestId);
      console.log('Declining friend request with ID:', requestId);
      
      // Find the request object to get full details
      const request = friendRequests.find(req => req._id === requestId);
      console.log('Found request object:', request);
      
      if (!request) {
        console.error('Friend request not found:', requestId);
        return;
      }
      
      // Decline the friend request using the correct ID
      const idToUse = request.id || request._id;
      console.log('Using ID for decline:', idToUse);
      
      await userService.declineFriendRequest(idToUse);
      console.log('Successfully declined friend request:', idToUse);
      
      // Remove the request from the list immediately
      setFriendRequests(prev => prev.filter(req => (req.id || req._id) !== idToUse));
      
      // Clear any existing errors
      setError(null);

    } catch (err) {
      console.error('Error declining friend request:', err);
      const errorMessage = err.response?.data?.message || 'Failed to decline friend request';
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

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
      // Only show "No connections found" if there are no connections of any type
      const hasAnyConnections = followers.length > 0 || following.length > 0 || friends.length > 0;
      const hasFriendRequests = friendRequests.length > 0;
      
      if (searchQuery) {
        return (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        );
      }

      if (!hasAnyConnections && !hasFriendRequests) {
        return (
          <div className="text-center py-8 text-gray-500">
            No connections found
          </div>
        );
      }

      // If we're on a specific tab with no connections but have other types of connections,
      // Don't show any message in friends tab if there are friend requests
      if (activeTab === 'friends' && hasFriendRequests) {
        return null;
      }

      // Show tab-specific messages for empty states
      return (
        <div className="text-center py-8 text-gray-500">
          {activeTab === 'friends' && !hasFriendRequests && 'No friends yet'}
          {activeTab === 'followers' && 'No followers yet'}
          {activeTab === 'following' && 'No following yet'}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {displayList.map((user) => (
          <Link 
            to={`/profile/${user.id}`}
            key={user.id}
            className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <Avatar 
              src={user.profilePicture} 
              className="w-12 h-12 border border-gray-200"
            >
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Avatar>
            <div className="ml-3 flex-grow">
              <Typography className="font-medium text-[#002B5B]">
                {user.username}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm">
                {user.professionalHeader}
              </Typography>
            </div>
            {user.id !== currentUser?.id && (
              <button 
                className={`px-4 py-1 text-sm rounded-full transition-colors ${
                  following.some(f => f.id === user.id)
                    ? 'border border-gray-300 bg-gray-100 text-gray-700'
                    : 'border border-[#002B5B] text-[#002B5B] hover:bg-[#002B5B]/5'
                }`}
              >
                {following.some(f => f.id === user.id) ? 'Following' : 'Follow'}
              </button>
            )}
          </Link>
        ))}
      </div>
    );
  };

  const renderFriendRequests = () => {
    console.log('Current friend requests:', friendRequests);
    
    if (!friendRequests.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          No pending friend requests
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Typography variant="h6" className="px-4 py-2 font-semibold text-[#002B5B]">
          Friend Requests ({friendRequests.length})
        </Typography>
        {friendRequests.map((request) => {
          console.log('Rendering request:', request); // Debug log
          return (
            <div 
              key={request._id}
              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b"
            >
              <Link to={`/profile/${request.sender.id}`} className="flex items-center flex-grow">
                <Avatar 
                  src={request.sender.profilePicture} 
                  className="w-12 h-12 border border-gray-200"
                >
                  {request.sender.firstName?.[0]}{request.sender.lastName?.[0]}
                </Avatar>
                <div className="ml-3">
                  <Typography className="font-medium text-[#002B5B]">
                    {request.sender.username}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {request.sender.professionalHeader}
                  </Typography>
                </div>
              </Link>
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    console.log('Accept button clicked for request:', request);
                    handleAcceptRequest(request._id);
                  }}
                  disabled={actionLoading === request._id}
                  startIcon={actionLoading === request._id ? <CircularProgress size={20} /> : <CheckIcon />}
                  sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#388E3C' },
                    '&:disabled': {
                      backgroundColor: '#4CAF50',
                      opacity: 0.7
                    }
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    console.log('Decline button clicked for request:', request);
                    handleDeclineRequest(request._id);
                  }}
                  disabled={actionLoading === request._id}
                  startIcon={actionLoading === request._id ? <CircularProgress size={20} /> : <CloseIcon />}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: 'rgba(244, 67, 54, 0.04)'
                    },
                    '&:disabled': {
                      borderColor: '#f44336',
                      color: '#f44336',
                      opacity: 0.7
                    }
                  }}
                >
                  Decline
                </Button>
              </div>
            </div>
          );
        })}
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
              {activeTab === 'followers' ? `${followers.length} followers` : 
               activeTab === 'following' ? `${following.length} following` : 
               `${friends.length} friends`}
            </Typography>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: '#002B5B',
              '&.Mui-selected': {
                color: '#F7931E',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#F7931E',
            },
          }}
        >
          <Tab value="friends" label="Friends" />
          <Tab value="followers" label="Followers" />
          <Tab value="following" label="Following" />
        </Tabs>
        
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
      </div>

      {/* Show error message if there's an error */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          <Button 
            onClick={fetchConnections}
            variant="text" 
            size="small"
            sx={{ mt: 1, color: 'inherit' }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="divide-y divide-gray-200">
        {/* Friend Requests Section - Only show on friends tab and for current user */}
        {activeTab === 'friends' && targetUserId === currentUser?.id && renderFriendRequests()}
        
        {/* Connections List */}
        {renderConnectionList(
          activeTab === 'followers' ? followers :
          activeTab === 'following' ? following :
          friends
        )}
      </div>
    </div>
  );
};

export default Connections;