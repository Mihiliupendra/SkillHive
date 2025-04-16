import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Edit as EditIcon, CameraAlt, PersonAdd, Share } from '@mui/icons-material';

const DEFAULT_COVER = '/images/Default Cover.png';
const DEFAULT_PROFILE = '/images/Default Profile Pic.png';

export default function ProfileHeader({ 
  user, 
  isOwnProfile, 
  onEditProfile, 
  onEditPhotos,
  isFollowing,
  onFollow,
  onShare,
  followLoading
}) {
  console.log('Profile Picture:', user?.profilePicture || DEFAULT_PROFILE); // Debug log
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-48">
        <img
          src={user?.coverPhoto || DEFAULT_COVER}
          alt="Cover photo"
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <Button
            startIcon={<CameraAlt />}
            variant="contained"
            onClick={onEditPhotos}
            sx={{ position: 'absolute', right: 16, bottom: 16 }}
          >
            Edit Cover
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Profile Picture */}
        <div className="absolute -top-16">
          <div className="relative h-32 w-32">
            <img
              src={user?.profilePicture || DEFAULT_PROFILE}
              alt={user?.fullName || 'User'}
              className="w-full h-full rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => {
                console.error('Error loading profile picture:', e);
                e.target.src = DEFAULT_PROFILE;
              }}
            />
          </div>
        </div>

        {/* User Info */}
        <div className="pt-20">
          <h1 className="text-3xl font-bold text-[#002B5B]">{user?.fullName || 'User'}</h1>
          <p className="text-xl text-[#002B5B]/80 mt-1">{user?.professionalHeader || 'No headline yet'}</p>
          <div className="flex items-center mt-2 text-[#002B5B]/60">
            <span className="material-icons text-lg mr-1">location_on</span>
            <span>{user?.city ? `${user.city}, ${user.country}` : 'Location not specified'} • {user?.connectionsCount || 0} connections</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          {isOwnProfile ? (
            <>
              <Button 
                startIcon={<EditIcon />} 
                variant="outlined" 
                onClick={onEditProfile}
                sx={{
                  borderColor: '#F7931E',
                  color: '#F7931E',
                  '&:hover': {
                    borderColor: '#e07b0d',
                    backgroundColor: 'rgba(247, 147, 30, 0.04)'
                  }
                }}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                onClick={onFollow}
                disabled={followLoading}
                startIcon={followLoading ? <CircularProgress size={20} /> : <PersonAdd />}
                sx={{
                  backgroundColor: isFollowing ? 'transparent' : '#F7931E',
                  borderColor: '#F7931E',
                  color: isFollowing ? '#F7931E' : 'white',
                  '&:hover': {
                    backgroundColor: isFollowing ? 'rgba(247, 147, 30, 0.04)' : '#e07b0d',
                    borderColor: '#e07b0d'
                  }
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            onClick={onShare}
            startIcon={<Share />}
            sx={{
              borderColor: '#002B5B',
              color: '#002B5B',
              '&:hover': {
                borderColor: '#001B3B',
                backgroundColor: 'rgba(0, 43, 91, 0.04)'
              }
            }}
          >
            Share Profile
          </Button>
        </div>
      </div>
    </div>
  );
} 