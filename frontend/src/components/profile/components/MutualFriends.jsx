import React, { useState, useEffect } from 'react';
import { Avatar, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../../../api/axios';

const MutualFriends = ({ currentUserId, profileUserId }) => {
  const [mutualFriends, setMutualFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMutualFriends = async () => {
      if (!currentUserId || !profileUserId || currentUserId === profileUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${currentUserId}/mutual-friends/${profileUserId}`);
        setMutualFriends(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching mutual friends:', err);
        setError('Failed to load mutual friends');
        setMutualFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMutualFriends();
  }, [currentUserId, profileUserId]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <CircularProgress size={24} />
      </div>
    );
  }

  if (error) {
    return null; // Hide the section if there's an error
  }

  if (!mutualFriends.length) {
    return null; // Hide the section if there are no mutual friends
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <Typography variant="h6" className="text-[#002B5B] font-medium mb-3">
        Mutual Friends ({mutualFriends.length})
      </Typography>
      <div className="space-y-3">
        {mutualFriends.slice(0, 5).map((friend) => (
          <Link
            key={friend.id}
            to={`/profile/${friend.id}`}
            className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <Avatar
              src={friend.profilePicture}
              className="w-10 h-10"
            >
              {friend.firstName?.[0]}{friend.lastName?.[0]}
            </Avatar>
            <div className="ml-3">
              <Typography className="font-medium text-[#002B5B]">
                {friend.username}
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm">
                {friend.professionalHeader || 'SkillHive Member'}
              </Typography>
            </div>
          </Link>
        ))}
        {mutualFriends.length > 5 && (
          <Link
            to={`/connections/${profileUserId}`}
            className="text-[#002B5B] hover:text-[#001B3B] text-sm font-medium block text-center mt-2"
          >
            View all mutual friends ({mutualFriends.length})
          </Link>
        )}
      </div>
    </div>
  );
};

export default MutualFriends;