import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import { userService } from '../../api/userService';
import { motion } from 'framer-motion';
import { Paper, Avatar, Button, Badge, CircularProgress } from '@mui/material';
import {
  ProfileHeader,
  ProfileAbout,
  ProfileExperience,
  ProfileEducation,
  ProfileSkills,
  ProfileProjects,
  ProfileSummary
} from './components';
import EditProfileModal from './components/EditProfileModal';
import MutualFriends from './components/MutualFriends';
import Dashboard from '../Dashboard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, refreshToken } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [friendRequestLoading, setFriendRequestLoading] = useState(false);
  const [hasPendingFriendRequest, setHasPendingFriendRequest] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userId) {
        throw new Error('No user ID provided');
      }      console.log('Fetching profile for userId:', userId);
      const [profileResponse, followingResponse] = await Promise.all([
        axios.get(`/api/users/${userId}/profile`),
        currentUser && userId !== currentUser.id 
          ? axios.get(`/api/users/${currentUser.id}/following`)
          : Promise.resolve({ data: [] })
      ]);
      
      if (!profileResponse.data) {
        throw new Error('No data received from server');
      }

      const userData = profileResponse.data;
      const transformedData = {
        ...userData,
        fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User',
        headline: userData.professionalHeader || 'No headline yet',
        about: userData.biography || 'No bio yet',
        location: userData.city && userData.country ? `${userData.city}, ${userData.country}` : 'Location not specified',
      };

      setProfileData(transformedData);
      
      // Check if the current user is following this profile
      if (currentUser && userId !== currentUser.id && followingResponse.data) {
        const followingData = Array.isArray(followingResponse.data) 
          ? followingResponse.data 
          : followingResponse.data.content || [];
          
        const isFollowingUser = followingData.some(user => 
          user.id === userId || user._id === userId
        );
        console.log('Is current user following this profile:', isFollowingUser);
        setIsFollowing(isFollowingUser);
      }

      // Check both friend request status and friendship status
      if (currentUser && userId !== currentUser.id) {
        try {
          // Check sent and received requests in parallel
          const [sentRequests, receivedRequests] = await Promise.all([
            userService.getPendingSentFriendRequests(currentUser.id),
            userService.getPendingReceivedFriendRequests(currentUser.id)
          ]);

          // Check if there's a pending request in either direction
          const hasSentPending = sentRequests.some(request => 
            request.receiver?.id === userId || request.receiverId === userId
          );
          const hasReceivedPending = receivedRequests.some(request => 
            request.sender?.id === userId || request.senderId === userId
          );

          setHasPendingFriendRequest(hasSentPending || hasReceivedPending);
          
          // You might want to also check if they are friends here if you have that endpoint
          // const friendsResponse = await userService.getFriendsList(currentUser.id);
          // setIsFriend(friendsResponse.some(friend => friend.id === userId));
        } catch (err) {
          console.error('Error checking friend status:', err);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      
      // Check if it's an authentication error
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Try to refresh the token first
        try {
          await refreshToken();
          // If refresh successful, retry the profile fetch
          const retryResponse = await axios.get(`/api/users/${userId}/profile`);
          if (retryResponse.data) {
            setProfileData(retryResponse.data);
            setError(null);
            return;
          }
        } catch (refreshErr) {
          // If refresh fails, redirect to login
          navigate('/signin', { state: { from: `/profile/${userId}` } });
          return;
        }
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load profile data';
      setError(`${errorMessage}. Please try again later.`);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };
  const handleFollow = async () => {
    if (!currentUser || !userId) return;
    
    setFollowLoading(true);
    try {
      if (!isFollowing) {
        // Follow the user
        await axios.post(`/api/users/${currentUser.id}/follow/${userId}`);
        setIsFollowing(true);
      } else {
        // Unfollow the user
        await axios.post(`/api/users/${currentUser.id}/unfollow/${userId}`);
        setIsFollowing(false);
      }
      
      // Fetch the updated following list to ensure UI is in sync with backend state
      const followingResponse = await axios.get(`/api/users/${currentUser.id}/following`);
      const followingData = Array.isArray(followingResponse.data) 
        ? followingResponse.data 
        : followingResponse.data.content || [];
        
      const isFollowingUser = followingData.some(user => 
        user.id === userId || user._id === userId
      );
      
      // Set the state based on the latest data from the server
      if (isFollowingUser !== isFollowing) {
        setIsFollowing(isFollowingUser);
      }
    } catch (err) {
      console.error('Follow/unfollow action failed:', err);
      // Show error notification to user
      setError('Failed to update follow status. Please try again.');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share profile clicked');
  };

  const handleSendFriendRequest = async () => {
    if (!currentUser || !userId) return;
    
    setFriendRequestLoading(true);
    try {
      if (hasPendingFriendRequest) {
        // Cancel the friend request
        await userService.cancelFriendRequest(currentUser.id, userId);
        setHasPendingFriendRequest(false);
      } else {
        // Send new friend request
        await userService.sendFriendRequest(currentUser.id, userId);
        setHasPendingFriendRequest(true);
      }
      
      // Use the new comprehensive status check
      const currentStatus = await userService.getPendingFriendRequestStatus(currentUser.id, userId);
      
      // Update state if it doesn't match the expected state
      if (currentStatus !== hasPendingFriendRequest) {
        setHasPendingFriendRequest(currentStatus);
      }
    } catch (err) {
      console.error('Friend request action failed:', err);
      setError(err.response?.data?.message || 
        (hasPendingFriendRequest ? 
          'Failed to cancel friend request. Please try again.' : 
          'Failed to send friend request. Please try again.'
        )
      );
      
      // Verify the current status after error
      try {
        const currentStatus = await userService.getPendingFriendRequestStatus(currentUser.id, userId);
        setHasPendingFriendRequest(currentStatus);
      } catch (statusErr) {
        console.error('Failed to verify friend request status:', statusErr);
      }
    } finally {
      setFriendRequestLoading(false);
    }
  };

  const checkFriendStatus = async () => {
    if (!currentUser || !userId || userId === currentUser.id) return;
    
    try {
      // Use the new comprehensive status check
      const isPending = await userService.getPendingFriendRequestStatus(currentUser.id, userId);
      console.log('Friend request status:', isPending);
      setHasPendingFriendRequest(isPending);
      
      // You might want to add an API endpoint to check if users are friends
      // For now, we'll assume they're not friends
      setIsFriend(false);
    } catch (err) {
      console.error('Error checking friend status:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      checkFriendStatus(); // Call checkFriendStatus here as well
    } else {
      setError('No user ID provided');
      setLoading(false);
    }
  }, [userId, currentUser]);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (formData) => {
    try {
      // Convert formData to match the backend User model structure
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        professionalHeader: formData.professionalHeader,
        biography: formData.biography,
        country: formData.country,
        city: formData.city,
        skills: formData.skills?.map(skill => skill.name) || []
      };

      const response = await axios.put(`/api/users/${userId}/profile`, userData);
      const updatedData = response.data;
      
      // Transform skills data to match the expected format
      const userSkills = updatedData.skills ? updatedData.skills.map((skill, index) => ({
        id: index + 1,
        name: typeof skill === 'string' ? skill : skill.name,
        level: typeof skill === 'string' ? 'Beginner' : (skill.level || 'Beginner')
      })) : [];

      // Update the local state with properly transformed data
      setProfileData({
        ...profileData,
        fullName: `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim() || 'Anonymous User',
        firstName: updatedData.firstName || '',
        lastName: updatedData.lastName || '',
        headline: updatedData.professionalHeader || 'Software Engineer',
        about: updatedData.biography || 'Passionate software engineer with expertise in full-stack development.',
        biography: updatedData.biography || '',
        professionalHeader: updatedData.professionalHeader || '',
        country: updatedData.country || '',
        city: updatedData.city || '',
        location: updatedData.city && updatedData.country ? `${updatedData.city}, ${updatedData.country}` : 'Location not specified',
        skills: userSkills
      });
      
      return updatedData;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const handleEditPhotos = () => {
    console.log('Edit photos clicked');
  };

  const handleConnect = () => {
    console.log('Connect button clicked');
  };

  const handleSkillsUpdate = async (updatedSkills) => {
    try {
      console.log('Received updated skills in Profile:', updatedSkills);
      
      // Create a copy of the current profile data
      const updatedProfileData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        professionalHeader: profileData.professionalHeader,
        biography: profileData.biography,
        country: profileData.country,
        city: profileData.city,
        // Send skills as an array of strings
        skills: updatedSkills
      };

      console.log('Sending userData to server:', updatedProfileData);

      const response = await axios.put(`/api/users/${userId}/profile`, updatedProfileData);
      console.log('Server response:', response.data);
      
      const updatedData = response.data;

      // Transform skills data to match the expected format
      const userSkills = updatedData.skills ? updatedData.skills.map((skill, index) => ({
        id: index + 1,
        name: skill,
        level: 'Beginner'
      })) : [];

      console.log('Transformed skills:', userSkills);

      // Update the profile data with the new skills
      setProfileData(prevData => {
        const newData = {
          ...prevData,
          skills: userSkills
        };
        console.log('Updated profile data:', newData);
        return newData;
      });

      // Refresh the profile data to ensure everything is in sync
      await fetchUserProfile();
    } catch (error) {
      console.error('Error updating skills:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <CircularProgress style={{ color: '#F7931E' }} size={60} thickness={4} />
          <p className="mt-4 text-[#002B5B] font-medium">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md"
        >
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-[#002B5B] mb-2">Profile Error</h2>
          <p className="text-[#002B5B]/80 mb-6">{error}</p>
          <Button
            variant="contained"
            style={{ backgroundColor: '#F7931E' }}
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchUserProfile();
            }}
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md"
        >
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-[#002B5B] mb-2">Profile Not Found</h2>
          <p className="text-[#002B5B]/80">The profile you're looking for doesn't exist.</p>
        </motion.div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">
      {/* Profile Header */}
      <ProfileHeader
        user={profileData}
        isOwnProfile={isOwnProfile}
        onEditProfile={handleEditProfile}
        onEditPhotos={handleEditPhotos}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onShare={handleShare}
        followLoading={followLoading}
        isFriend={isFriend}
        onSendFriendRequest={handleSendFriendRequest}
        friendRequestLoading={friendRequestLoading}
        hasPendingFriendRequest={hasPendingFriendRequest}
      />

      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profileData}
        onSave={handleSaveProfile}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProfileSummary
                name={profileData.fullName}
                title={profileData.headline}
                profileViews={profileData.profileViews}
                connections={profileData.connectionsCount}
                variant="compact"
              />
            </motion.div>

            {/* Display mutual friends only if not own profile */}
            {!isOwnProfile && currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MutualFriends
                  currentUserId={currentUser.id}
                  profileUserId={userId}
                />
              </motion.div>
            )}

            {/* Skills Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Paper className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-[#002B5B] mb-4 flex items-center">
                  <span className="material-icons mr-2 text-[#F7931E]">star</span>
                  Skills & Endorsements
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(profileData.skills || []).slice(0, 5).map((skill, index) => (
                    <span 
                      key={skill.id || index}
                      className="px-3 py-1 bg-[#F7931E]/10 text-[#002B5B] rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {(!profileData.skills || profileData.skills.length === 0) && (
                    <span className="text-[#002B5B]/60">No skills added yet</span>
                  )}
                </div>
                <Button
                  fullWidth
                  variant="outlined"
                  style={{ color: '#F7931E', borderColor: '#F7931E' }}
                  onClick={() => setActiveTab('skills')}
                >
                  View All Skills
                </Button>
              </Paper>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Paper className="p-2 rounded-xl">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {['about', 'experience', 'education', 'skills', 'projects'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 mx-1 rounded-lg font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'bg-[#F7931E] text-white'
                          : 'text-[#002B5B] hover:bg-[#F7931E]/10'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </Paper>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Dashboard Stats */}
              <Dashboard profileData={profileData} />

              {activeTab === 'about' && <ProfileAbout about={profileData.about} />}
              {activeTab === 'experience' && <ProfileExperience experience={profileData.experience} />}
              {activeTab === 'education' && <ProfileEducation education={profileData.education} />}
              {activeTab === 'skills' && (
                <ProfileSkills 
                  skills={profileData.skills} 
                  isOwnProfile={isOwnProfile}
                  onSkillsUpdate={handleSkillsUpdate}
                />
              )}
              {activeTab === 'projects' && <ProfileProjects projects={profileData.projects} />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;