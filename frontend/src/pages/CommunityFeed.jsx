// src/pages/CommunityFeed.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
  CircularProgress,
  Pagination,
  Chip,
  Stack,
  Divider,
  IconButton,
  alpha,
  Tooltip,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import ChatBox from '../components/community/ChatBox';
import CommunityService from '../services/communityService';
import { userService } from '../api/userService';
import { AuthContext } from '../context/AuthContext';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DescriptionIcon from '@mui/icons-material/Description';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';

// Theme colors
const themeColors = {
  primary: '#002B5B',
  accent: '#F7931E',
  white: '#FFFFFF',
  primaryDark: '#1A2B3C' // Added for text contrast
};

// Styled components with enhanced, professional, and simple styling
const BannerPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 24px rgba(0, 43, 91, 0.1)',
  background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${alpha(themeColors.accent, 0.9)} 100%)`,
  color: themeColors.white,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle at top right, ${alpha(themeColors.white, 0.1)}, transparent 70%)`,
    zIndex: 0
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(0, 43, 91, 0.06)',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 43, 91, 0.1)',
    transform: 'translateY(-4px)'
  }
}));

const SectionPaper = styled(StyledPaper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `1px solid ${alpha(themeColors.primary, 0.1)}`
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: themeColors.primary,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  fontSize: '1.2rem',
  letterSpacing: '0.2px'
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  background: alpha(themeColors.accent, 0.1),
  color: themeColors.accent,
  fontWeight: 600,
  fontSize: '0.8rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: alpha(themeColors.accent, 0.2),
    transform: 'translateY(-2px)'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 43, 91, 0.2)'
  }
}));

const JoinButton = styled(StyledButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${themeColors.accent}, ${alpha(themeColors.primary, 0.9)})`,
  color: themeColors.white,
  '&:hover': {
    background: `linear-gradient(135deg, ${alpha(themeColors.accent, 0.9)}, ${alpha(themeColors.primary, 0.8)})`,
    boxShadow: `0 6px 16px ${alpha(themeColors.accent, 0.4)}`
  }
}));

const LeaveButton = styled(StyledButton)(({ theme }) => ({
  background: alpha(themeColors.primary, 0.1),
  color: themeColors.primary,
  border: `1px solid ${alpha(themeColors.primary, 0.3)}`,
  '&:hover': {
    background: alpha(themeColors.primary, 0.2),
    border: `1px solid ${themeColors.primary}`
  }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    background: alpha(themeColors.primary, 0.05),
    transform: 'translateX(4px)'
  }
}));

const StyledAvatar = styled(Avatar)(({ theme, isadmin }) => ({
  background: isadmin === 'true' 
    ? `linear-gradient(135deg, ${themeColors.accent}, ${alpha(themeColors.primary, 0.9)})` 
    : alpha(themeColors.primary, 0.8),
  fontWeight: 700,
  width: 48,
  height: 48,
  border: isadmin === 'true' ? `2px solid ${themeColors.accent}` : `2px solid ${themeColors.white}`,
  boxShadow: '0 3px 8px rgba(0, 43, 91, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 5px 12px rgba(0, 43, 91, 0.15)'
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  background: alpha(themeColors.white, 0.9),
  border: `1px solid ${alpha(themeColors.primary, 0.1)}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: alpha(themeColors.primary, 0.05),
    transform: 'translateX(4px)'
  }
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  background: alpha(themeColors.primary, 0.1),
  color: themeColors.primary,
  fontWeight: 600,
  borderRadius: '12px',
  fontSize: '0.8rem',
  '& .MuiChip-icon': {
    color: themeColors.primary
  },
  transition: 'all 0.2s ease',
  '&:hover': {
    background: alpha(themeColors.primary, 0.2),
    transform: 'translateY(-2px)'
  }
}));

const EmptyStatePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  textAlign: 'center',
  background: alpha(themeColors.primary, 0.02),
  border: `1px dashed ${alpha(themeColors.primary, 0.2)}`,
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(0, 43, 91, 0.06)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: alpha(themeColors.primary, 0.04),
    boxShadow: '0 6px 20px rgba(0, 43, 91, 0.08)'
  }
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  background: alpha(themeColors.white, 0.2),
  color: themeColors.white,
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: alpha(themeColors.white, 0.3),
    transform: 'scale(1.1)'
  }
}));

const MemberCount = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: alpha(themeColors.white, 0.2),
  padding: '6px 12px',
  borderRadius: '16px',
  border: `1px solid ${alpha(themeColors.white, 0.3)}`,
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(0.5),
    fontSize: 18
  },
  '& .MuiTypography-root': {
    fontSize: '0.85rem',
    fontWeight: 600
  }
}));

const PostsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  background: alpha(themeColors.primary, 0.05),
  borderRadius: '12px',
  borderLeft: `4px solid ${themeColors.accent}`
}));

const CommunityFeed = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [detailedMembers, setDetailedMembers] = useState({});
  const [detailedAdmins, setDetailedAdmins] = useState({});
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const pageSize = 5;
  const [activeTab, setActiveTab] = useState('posts');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    fetchCommunityDetails();
  }, [communityId]);

  useEffect(() => {
    if (community) {
      fetchCommunityPosts();
    }
  }, [community, page]);

  useEffect(() => {
    if (members && members.length > 0) {
      fetchMemberDetails();
    }
  }, [members]);

  useEffect(() => {
    if (admins && admins.length > 0) {
      fetchAdminDetails();
    }
  }, [admins]);

  const fetchMemberDetails = async () => {
    setMembersLoading(true);
    const memberDetails = { ...detailedMembers };
    try {
      for (const memberId of members) {
        if (memberDetails[memberId]) continue;
        try {
          const userData = await userService.getUserById(memberId);
          memberDetails[memberId] = userData;
        } catch (error) {
          console.error(`Error fetching details for member ${memberId}:`, error);
          memberDetails[memberId] = {
            fullName: 'Unknown User',
            username: 'unknown',
            profilePicture: '/images/Default Profile Pic.png'
          };
        }
      }
      setDetailedMembers(memberDetails);
    } catch (error) {
      console.error('Error fetching member details:', error);
    } finally {
      setMembersLoading(false);
    }
  };

  const fetchAdminDetails = async () => {
    const adminDetails = { ...detailedAdmins };
    try {
      for (const adminId of admins) {
        if (adminDetails[adminId]) continue;
        try {
          const userData = await userService.getUserById(adminId);
          adminDetails[adminId] = userData;
        } catch (error) {
          console.error(`Error fetching details for admin ${adminId}:`, error);
          adminDetails[adminId] = {
            fullName: 'Unknown Admin',
            username: 'unknown',
            profilePicture: '/images/Default Profile Pic.png'
          };
        }
      }
      setDetailedAdmins(adminDetails);
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };

  const fetchCommunityDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching community details for ID: ${communityId}`);
      const communityResponse = await CommunityService.getCommunityById(communityId);
      console.log('Community response:', communityResponse.data);
      
      const communityData = communityResponse.data;
      setCommunity(communityData);
      
      if (user) {
        const memberIds = communityData.memberIds || [];
        const adminIds = communityData.adminIds || [];
        console.log('Member IDs:', memberIds);
        console.log('Admin IDs:', adminIds);
        console.log('Current user ID:', user.id);
        setIsMember(memberIds.includes(user.id));
        setIsAdmin(adminIds.includes(user.id));
      }

      try {
        const membersResponse = await CommunityService.getCommunityMembers(communityId);
        console.log('Members response:', membersResponse.data);
        if (Array.isArray(membersResponse.data)) {
          setMembers(membersResponse.data);
        } else if (membersResponse.data && Array.isArray(membersResponse.data.content)) {
          setMembers(membersResponse.data.content);
        } else if (communityData.memberIds && Array.isArray(communityData.memberIds)) {
          setMembers(communityData.memberIds);
        } else {
          console.log('No valid members data found');
          setMembers([]);
        }
      } catch (membersError) {
        console.error('Error fetching community members:', membersError);
        setMembers(communityData.memberIds || []);
      }

      try {
        const adminsResponse = await CommunityService.getCommunityAdmins(communityId);
        console.log('Admins response:', adminsResponse.data);
        if (Array.isArray(adminsResponse.data)) {
          setAdmins(adminsResponse.data);
        } else if (adminsResponse.data && Array.isArray(adminsResponse.data.content)) {
          setAdmins(adminsResponse.data.content);
        } else if (communityData.adminIds && Array.isArray(communityData.adminIds)) {
          setAdmins(communityData.adminIds);
        } else {
          console.log('No valid admins data found');
          setAdmins([]);
        }
      } catch (adminsError) {
        console.error('Error fetching community admins:', adminsError);
        setAdmins(communityData.adminIds || []);
      }
    } catch (error) {
      console.error('Error fetching community details:', error);
      setError('Failed to load community details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityPosts = async () => {
    setPostsLoading(true);
    try {
      console.log(`Fetching posts for community ID: ${communityId}, page: ${page}, size: ${pageSize}`);
      try {
        const postsResponse = await CommunityService.getCommunityPosts(communityId, page, pageSize);
        if (postsResponse && postsResponse.data) {
          console.log('Posts response:', postsResponse.data);
          if (postsResponse.data.content) {
            setPosts(postsResponse.data.content);
            setTotalPages(postsResponse.data.totalPages || 1);
          } else if (Array.isArray(postsResponse.data)) {
            setPosts(postsResponse.data);
            setTotalPages(Math.ceil(postsResponse.data.length / pageSize) || 1);
          } else {
            console.log('No posts found or invalid response format');
            setPosts([]);
            setTotalPages(0);
          }
        } else {
          console.log('Empty response from API');
          setPosts([]);
          setTotalPages(0);
        }
      } catch (specificError) {
        console.error('Error with community posts endpoint:', specificError);
        setPosts([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
      setPosts([]);
      setTotalPages(0);
    } finally {
      setPostsLoading(false);
    }
  };
  const handleJoinCommunity = async () => {
    if (!user) return;
    try {
      console.log(`User ${user.id} joining community ${communityId}`);
      
      // Check if token exists before making request
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No authentication token found. User may need to log in again.");
        // You could redirect to login or show a message here
        return;
      }
      
      await CommunityService.addMember(communityId, user.id);
      setIsMember(true);
      fetchCommunityDetails();
    } catch (error) {
      console.error('Error joining community:', error);
      
      // Show more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
        
        // Handle specific status codes
        if (error.response.status === 403) {
          console.log("Access forbidden - you may not have permission to join this community");
          // You could display a more user-friendly message here
        }
      }
    }
  };
  const handleLeaveCommunity = async () => {
    if (!user) return;
    try {
      console.log(`User ${user.id} leaving community ${communityId}`);
      
      // Check if token exists before making request
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No authentication token found. User may need to log in again.");
        // You could redirect to login or show a message here
        return;
      }
      
      await CommunityService.removeMember(communityId, user.id);
      setIsMember(false);
      setIsAdmin(false);
      fetchCommunityDetails();
    } catch (error) {
      console.error('Error leaving community:', error);
      
      // Show more detailed error information
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        
        // Handle specific status codes
        if (error.response.status === 403) {
          console.log("Access forbidden - you may not have permission to leave this community");
          // You could display a more user-friendly message here
        }
      }
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <CircularProgress sx={{ color: themeColors.accent }} size={48} thickness={4} />
        <Typography sx={{ mt: 2, color: themeColors.primaryDark, fontWeight: 600 }}>
          Loading community...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <EmptyStatePaper>
          <Typography variant="h5" color="error" sx={{ mb: 2, fontWeight: 700 }}>{error}</Typography>
          <StyledButton 
            variant="outlined" 
            onClick={fetchCommunityDetails}
            sx={{ 
              borderColor: themeColors.primary, 
              color: themeColors.primary,
              '&:hover': { 
                borderColor: themeColors.accent, 
                background: alpha(themeColors.primary, 0.05) 
              }
            }}
          >
            Try Again
          </StyledButton>
        </EmptyStatePaper>
      </Container>
    );
  }

  if (!community) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <EmptyStatePaper>
          <Typography variant="h4" sx={{ color: themeColors.primaryDark, mb: 2, fontWeight: 700 }}>
            Community not found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The community you're looking for might have been removed or is not accessible.
          </Typography>
        </EmptyStatePaper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <BannerPaper elevation={5} sx={{ 
        borderRadius: '16px',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(themeColors.primary, 0.9)}, ${alpha(themeColors.accent, 0.85)})`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 8px 32px ${alpha(themeColors.primary, 0.25)}`
      }}>
        <Box sx={{ 
          position: 'relative', 
          zIndex: 1, 
          p: { xs: 3, md: 4 },
          backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.12), transparent 40%)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ maxWidth: { xs: '100%', sm: '70%' } }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                mb: 1.5,
                background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0.85))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                {community.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <CategoryChip 
                  icon={<LocalOfferIcon />}
                  label={community.category || 'Uncategorized'} 
                  size="medium"
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.3)',
                    }
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: alpha(themeColors.white, 0.9),
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '20px',
                  py: 0.5,
                  px: 1.5
                }}>
                  <GroupIcon sx={{ mr: 0.8, fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {members ? members.length : 0} members
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ 
                mb: 3.5, 
                maxWidth: '90%',
                color: alpha(themeColors.white, 0.95),
                lineHeight: 1.6,
                fontSize: '1.05rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                {community.description || 'No description available'}
              </Typography>
            </Box>
            <Box sx={{ mt: { xs: 1, sm: 0 } }}>
              {user && (
                isMember ? (
                  <LeaveButton 
                    variant="outlined" 
                    onClick={handleLeaveCommunity}
                    startIcon={<ExitToAppIcon />}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      fontWeight: 600,
                      px: 2.5,
                      py: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    Leave Community
                  </LeaveButton>
                ) : (
                  <JoinButton 
                    variant="contained" 
                    onClick={handleJoinCommunity}
                    startIcon={<PersonAddIcon />}
                    sx={{
                      backgroundColor: 'white',
                      color: themeColors.primary,
                      borderRadius: '12px',
                      fontWeight: 700,
                      px: 2.5,
                      py: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(themeColors.white, 0.9),
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    Join Community
                  </JoinButton>
                )
              )}
            </Box>
          </Box>
          
          {community.tags && community.tags.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {community.tags.map((tag, idx) => (
                <StyledChip 
                  key={idx} 
                  label={tag} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      transform: 'translateY(-1px)'
                    }
                  }} 
                />
              ))}
            </Stack>
          )}
        </Box>
      </BannerPaper>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <SectionPaper>
            <SectionTitle variant="h6">
              <PublicIcon sx={{ color: themeColors.primary }} />
              <Box component="span">Community Info</Box>
            </SectionTitle>
            <List sx={{ p: 0 }}>
              {[
                { icon: CalendarTodayIcon, label: 'Created:', value: formatDate(community.createdAt) },
                { icon: GroupIcon, label: 'Members:', value: members ? members.length : 0 },
                { 
                  icon: community.isPublic ? PublicIcon : LockIcon, 
                  label: 'Visibility:', 
                  value: community.isPublic ? 'Public' : 'Private' 
                }
              ].map((item, index) => (
                <ListItem key={index} sx={{ p: 1 }}>
                  <InfoItem sx={{ width: '100%' }}>
                    <item.icon sx={{ color: themeColors.accent, fontSize: '1.3rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: themeColors.primaryDark }}>
                      <Box component="span" sx={{ fontWeight: 700, color: themeColors.primary }}>
                        {item.label}
                      </Box> {item.value}
                    </Typography>
                  </InfoItem>
                </ListItem>
              ))}
            </List>
          </SectionPaper>

          <SectionPaper sx={{ mt: 3 }}>
            <SectionTitle variant="h6">
              <SupervisorAccountIcon sx={{ color: themeColors.primary }} />
              <Box component="span">Administrators</Box>
            </SectionTitle>
            <List disablePadding sx={{ p: 0 }}>
              {admins && admins.length > 0 ? (
                <List disablePadding>
                  {admins.map((adminId) => (
                    <StyledListItem key={adminId} disablePadding sx={{ mb: 1 }}>
                      <ListItemAvatar>
                        <StyledAvatar 
                          isadmin="true" 
                          src={detailedAdmins[adminId]?.profilePicture || ''}
                        >
                          {detailedAdmins[adminId] ? 
                            (detailedAdmins[adminId].username?.charAt(0) || detailedAdmins[adminId].fullName?.charAt(0) || '?').toUpperCase() : 
                            (adminId?.charAt(0) || '?').toUpperCase()
                          }
                        </StyledAvatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={detailedAdmins[adminId] ? 
                          (detailedAdmins[adminId].fullName || detailedAdmins[adminId].username) : 
                          adminId
                        } 
                        primaryTypographyProps={{ 
                          fontWeight: 600, 
                          fontSize: '0.95rem', 
                          color: themeColors.primaryDark 
                        }}
                        secondary="Administrator"
                        secondaryTypographyProps={{ 
                          color: themeColors.accent, 
                          fontSize: '0.8rem', 
                          fontWeight: 500 
                        }}
                      />
                    </StyledListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}>
                  No administrators found
                </Typography>
              )}
            </List>
          </SectionPaper>

          <SectionPaper sx={{ mt: 3 }}>
            <SectionTitle variant="h6">
              <PeopleIcon sx={{ color: themeColors.primary }} />
              <Box component="span">Community Members</Box>
            </SectionTitle>
            <List disablePadding sx={{ p: 0 }}>
              {membersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={32} sx={{ color: themeColors.accent }} />
                </Box>
              ) : members && members.length > 0 ? (
                <List disablePadding>
                  {members.slice(0, 5).map((memberId) => (
                    <StyledListItem key={memberId} disablePadding sx={{ mb: 1 }}>
                      <ListItemAvatar>
                        <StyledAvatar 
                          isadmin={admins && admins.includes(memberId) ? 'true' : 'false'}
                          src={detailedMembers[memberId]?.profilePicture || ''}
                        >
                          {detailedMembers[memberId] ? 
                            (detailedMembers[memberId].username?.charAt(0) || detailedMembers[memberId].fullName?.charAt(0) || '?').toUpperCase() : 
                            (memberId?.charAt(0) || '?').toUpperCase()
                          }
                        </StyledAvatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={detailedMembers[memberId] ? 
                          (detailedMembers[memberId].fullName || detailedMembers[memberId].username) : 
                          memberId
                        }
                        primaryTypographyProps={{ 
                          fontWeight: 600, 
                          fontSize: '0.95rem', 
                          color: themeColors.primaryDark 
                        }}
                        secondary={admins && admins.includes(memberId) ? 'Admin' : 'Member'}
                        secondaryTypographyProps={{ 
                          color: admins && admins.includes(memberId) ? themeColors.accent : themeColors.primaryDark,
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      />
                    </StyledListItem>
                  ))}
                  {members.length > 5 && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          color: themeColors.primary, 
                          fontWeight: 600, 
                          px: 2, 
                          py: 1, 
                          borderRadius: '12px',
                          background: alpha(themeColors.primary, 0.05),
                          display: 'inline-block',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: alpha(themeColors.primary, 0.1),
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        +{members.length - 5} more members
                      </Typography>
                    </Box>
                  )}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}>
                  No members have joined yet
                </Typography>
              )}
            </List>
          </SectionPaper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <SectionPaper sx={{ mb: 3, p: 0 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ 
                '& .MuiTabs-indicator': {
                  background: '#002B5B',
                  height: '3px'
                },
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 2,
                  transition: 'all 0.2s ease',
                  color: 'rgba(0, 43, 91, 0.7)',
                  '&:hover': {
                    background: alpha(themeColors.primary, 0.05),
                    color: themeColors.primary
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.4rem',
                    mr: 1
                  }
                },
                '& .Mui-selected': {
                  color: '#002B5B !important',
                  fontWeight: 700
                }
              }}
            >
              
              <Tab 
                value="chat" 
                label="Live Chat" 
                icon={<ChatIcon />} 
                iconPosition="start" 
              />
            </Tabs>
          </SectionPaper>

          
          {activeTab === 'chat' && (
            <SectionPaper sx={{ 
              height: 'auto', 
              minHeight: '500px',
              maxHeight: '80vh',
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'visible', // Allow content to be visible outside container if needed
              p: 0 // Remove padding for proper chat display
            }}>
              {isMember ? (
                <Box sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  overflow: 'visible',
                  height: '100%'
                }}>
                  <ChatBox 
                    communityId={communityId} 
                    sx={{
                      height: '100%',
                      maxHeight: '70vh',
                      '& .message-bubble': {
                        borderRadius: '12px',
                        background: themeColors.white,
                        border: `1px solid ${alpha(themeColors.primary, 0.1)}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: alpha(themeColors.primary, 0.05)
                        }
                      },
                      '& .message-input': {
                        borderRadius: '10px',
                        border: `1px solid ${alpha(themeColors.primary, 0.2)}`,
                        '&:focus': {
                          borderColor: themeColors.accent
                        }
                      },
                      '& .send-button': {
                        borderRadius: '10px',
                        background: themeColors.accent,
                        color: themeColors.white,
                        '&:hover': {
                          background: alpha(themeColors.accent, 0.9)
                        }
                      }
                    }}
                  />
                </Box>
              ) : (
                <EmptyStatePaper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <ChatIcon sx={{ fontSize: 60, color: themeColors.accent, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: themeColors.primaryDark, mb: 2, fontWeight: 700 }}>
                    Join the community to participate
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '80%' }}>
                    Only community members can participate in the live chat. Join now to connect with other members in real-time.
                  </Typography>
                  <JoinButton 
                    variant="contained" 
                    onClick={handleJoinCommunity}
                    startIcon={<PersonAddIcon />}
                  >
                    Join Community
                  </JoinButton>
                </EmptyStatePaper>
              )}
            </SectionPaper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommunityFeed;