import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { ProfileSummary } from '../components/profile/components';

function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    name: user?.username || 'Guest',
    profession: '',
    location: '',
    profileViews: 0,
    connections: 0,
    initials: user?.username ? user.username.substring(0, 2).toUpperCase() : 'GU',
    profileImage: null,
    newNotifications: 3
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`/api/users/${user.id}/profile`);
          const profileData = response.data;
          
          setUserData(prev => ({
            ...prev,
            name: `${profileData.firstName} ${profileData.lastName}`,
            profession: profileData.professionalHeader || 'No profession set',
            location: profileData.city && profileData.country 
              ? `${profileData.city}, ${profileData.country}`
              : 'Location not set',
            profileViews: profileData.profileViews || 0,
            connections: profileData.connectionsCount || 0,
            initials: profileData.firstName && profileData.lastName 
              ? `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase()
              : user.username.substring(0, 2).toUpperCase(),
            profileImage: profileData.profilePicture
          }));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#002B5B] to-[#F7931E]/20">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7931E] mx-auto mb-4"></div>
          <p className="text-[#002B5B]">Loading user session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] px-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ProfileSummary
                name={userData.name}
                title={userData.profession}
                profileViews={userData.profileViews}
                connections={userData.connections}
                profileImage={userData.profileImage}
                variant="full"
              />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Paper className="p-6 rounded-2xl shadow-lg bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#002B5B]">Recent Activity</h3>
                  <span className="material-icons text-[#002B5B]/50">more_horiz</span>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <motion.div 
                      key={item}
                      whileHover={{ x: 5 }}
                      className="flex items-start p-3 hover:bg-[#F7931E]/5 rounded-lg transition-all duration-300 cursor-pointer"
                    >
                      <div className="bg-[#F7931E]/10 p-2 rounded-full mr-3">
                        <span className="material-icons text-[#F7931E] text-sm">
                          {item === 1 ? 'thumb_up' : item === 2 ? 'comment' : 'group'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-[#002B5B]">
                          {item === 1 ? 'Your post received 5 new likes' : 
                           item === 2 ? 'New comment on your skill share' : 
                           'You joined Web Development group'}
                        </p>
                        <p className="text-xs text-[#002B5B]/50">
                          {item === 1 ? '2 hours ago' : item === 2 ? '5 hours ago' : 'Yesterday'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2 text-[#F7931E] font-medium rounded-lg hover:bg-[#F7931E]/10 transition-colors duration-300 flex items-center justify-center">
                  Show all activity
                  <span className="material-icons ml-1 text-sm">arrow_forward</span>
                </button>
              </Paper>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Main content area - you can add new content here */}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Paper className="p-6 rounded-2xl shadow-lg bg-white">
                <h2 className="text-lg font-bold text-[#002B5B] mb-4">Resources</h2>
                <div className="space-y-3">
                  {[
                    { icon: 'visibility', title: 'Creator mode', desc: 'Get discovered, showcase content', path: '/creator' },
                    { icon: 'people', title: 'My Network', desc: 'Manage your connections', path: '/my-network' },
                    { icon: 'bookmark', title: 'My items', desc: 'Save jobs and content', path: '/saved' },
                    { icon: 'school', title: 'Learning', desc: 'Expand your skills', path: '/learning' }
                  ].map((resource, index) => (
                    <Link 
                      key={index}
                      to={resource.path} 
                      className="flex items-start p-3 hover:bg-[#002B5B]/5 rounded-xl group transition-all duration-300"
                    >
                      <div className="p-2 rounded-lg bg-[#002B5B]/5 group-hover:bg-[#002B5B]/10 transition-colors">
                        <span className="material-icons text-[#002B5B]">{resource.icon}</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-[#002B5B] group-hover:text-[#F7931E] transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-[#002B5B]/70">{resource.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Paper>
            </motion.div>

            {/* Premium Upgrade Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-[#002B5B] to-[#F7931E] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Premium</h3>
                    <p className="text-sm opacity-80">Unlock all features</p>
                  </div>
                  <span className="material-icons text-white/80">stars</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {['Advanced analytics', 'Exclusive content', 'Priority support'].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="material-icons text-sm mr-2">check_circle</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2 bg-white text-[#002B5B] font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Upgrade Now
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
