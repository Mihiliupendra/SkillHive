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
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';

// Theme colors
const themeColors = {
  primary: '#002B5B',
  accent: '#F7931E',
  white: '#FFFFFF'
};

// Styled components with enhanced styling for a more professional look
const BannerPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '20px',
  marginBottom: theme.spacing(4),
  boxShadow: '0 10px 40px rgba(0, 43, 91, 0.15)',
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: `linear-gradient(135deg, ${alpha(themeColors.primary, 0.97)} 0%, ${alpha(themeColors.primary, 0.9)} 100%)`,
  color: themeColors.white,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.1,
    zIndex: 0
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '300px',
    height: '300px',
    background: `radial-gradient(circle, ${alpha(themeColors.accent, 0.3)} 0%, transparent 70%)`,
    zIndex: 0,
    borderRadius: '50%',
    transform: 'translate(30%, 30%)',
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 43, 91, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(themeColors.primary, 0.06)}`,
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 43, 91, 0.12)',
  }
}));

const SectionPaper = styled(StyledPaper)(({ theme }) => ({
  padding: theme.spacing(3.5),
  marginBottom: theme.spacing(3.5),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: `linear-gradient(90deg, ${themeColors.primary} 0%, ${themeColors.accent} 100%)`,
    borderRadius: '4px 4px 0 0',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: themeColors.primary,
  marginBottom: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '40px',
    height: '3px',
    backgroundColor: themeColors.accent,
    borderRadius: '2px',
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '30px',
  padding: '0 4px',
  backgroundColor: alpha(themeColors.accent, 0.15),
  color: themeColors.accent,
  fontWeight: 600,
  boxShadow: '0 2px 6px rgba(247, 147, 30, 0.15)',
  border: `1px solid ${alpha(themeColors.accent, 0.2)}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(themeColors.accent, 0.25),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(247, 147, 30, 0.25)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0, 43, 91, 0.15)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0, 43, 91, 0.2)',
  }
}));

const JoinButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: themeColors.accent,
  color: themeColors.white,
  '&:hover': {
    backgroundColor: alpha(themeColors.accent, 0.85),
    boxShadow: '0 6px 15px rgba(247, 147, 30, 0.3)'
  }
}));

const LeaveButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: alpha(themeColors.primary, 0.1),
  color: themeColors.white,
  borderColor: 'transparent',
  backdropFilter: 'blur(5px)',
  '&:hover': {
    backgroundColor: alpha(themeColors.primary, 0.15),
    borderColor: 'transparent'
  }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '10px',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  transition: 'all 0.2s ease',
  border: `1px solid transparent`,
  '&:hover': {
    backgroundColor: alpha(themeColors.primary, 0.04),
    transform: 'translateX(5px)',
    border: `1px solid ${alpha(themeColors.primary, 0.1)}`,
  }
}));

const StyledAvatar = styled(Avatar)(({ theme, isadmin }) => ({
  backgroundColor: isadmin === 'true' ? themeColors.accent : alpha(themeColors.primary, 0.9),
  fontWeight: 'bold',
  boxShadow: isadmin === 'true' 
    ? '0 4px 10px rgba(247, 147, 30, 0.25)'
    : '0 4px 10px rgba(0, 43, 91, 0.15)',
  border: isadmin === 'true'
    ? `2px solid ${themeColors.accent}`
    : `2px solid ${themeColors.white}`,
  width: 45,
  height: 45,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.8),
  padding: theme.spacing(1.5),
  borderRadius: '10px',
  backgroundColor: alpha(themeColors.primary, 0.03),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(themeColors.primary, 0.06),
    transform: 'translateX(5px)',
  }
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(themeColors.primary, 0.1),
  color: themeColors.primary,
  fontWeight: 700,
  borderRadius: '30px',
  padding: '0 5px',
  border: `1px solid ${alpha(themeColors.primary, 0.15)}`,
  boxShadow: '0 2px 6px rgba(0, 43, 91, 0.1)',
  '& .MuiChip-icon': {
    color: themeColors.primary
  },
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 43, 91, 0.15)',
  }
}));

const EmptyStatePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  textAlign: 'center',
  backgroundColor: alpha(themeColors.primary, 0.02),
  border: `1px dashed ${alpha(themeColors.primary, 0.2)}`,
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `radial-gradient(${alpha(themeColors.primary, 0.03)} 2px, transparent 2px)`,
    backgroundSize: '20px 20px',
    opacity: 0.5,
  }
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(themeColors.white, 0.2),
  color: themeColors.white,
  marginBottom: theme.spacing(2),
  backdropFilter: 'blur(5px)',
  border: `1px solid ${alpha(themeColors.white, 0.3)}`,
  '&:hover': {
    backgroundColor: alpha(themeColors.white, 0.3),
  }
}));

const MemberCount = styled(Box)(({ theme }) => ({
  display: 'flex', 
  alignItems: 'center', 
  backgroundColor: alpha(themeColors.white, 0.15),
  padding: '6px 12px',
  borderRadius: '20px',
  backdropFilter: 'blur(5px)',
  border: `1px solid ${alpha(themeColors.white, 0.25)}`,
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(0.5),
    fontSize: 18,
  },
  '& .MuiTypography-root': {
    fontSize: '0.875rem',
    fontWeight: 600,
  }
}));

const PostsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: alpha(themeColors.primary, 0.03),
  borderRadius: '12px',
  borderLeft: `4px solid ${themeColors.accent}`,
}));

const CommunityFeed = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [detailedMembers, setDetailedMembers] = useState({});  // Object to store user details by ID
  const [detailedAdmins, setDetailedAdmins] = useState({});    // Object to store admin details by ID
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

  useEffect(() => {
    fetchCommunityDetails();
  }, [communityId]);

  useEffect(() => {
    if (community) {
      fetchCommunityPosts();
    }
  }, [community, page]);

  // Add a new useEffect to fetch user details for members
  useEffect(() => {
    if (members && members.length > 0) {
      fetchMemberDetails();
    }
  }, [members]);

  // Add a new useEffect to fetch user details for admins
  useEffect(() => {
    if (admins && admins.length > 0) {
      fetchAdminDetails();
    }
  }, [admins]);

  // Function to fetch details for all members
  const fetchMemberDetails = async () => {
    setMembersLoading(true);
    const memberDetails = { ...detailedMembers };

    try {
      // Process members in batches to avoid too many simultaneous requests
      for (const memberId of members) {
        // Skip if we already have the details for this member
        if (memberDetails[memberId]) continue;

        try {
          const userData = await userService.getUserById(memberId);
          memberDetails[memberId] = userData;
        } catch (error) {
          console.error(`Error fetching details for member ${memberId}:`, error);
          // Use a default object if we can't get the real user data
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

  // Function to fetch details for all admins
  const fetchAdminDetails = async () => {
    const adminDetails = { ...detailedAdmins };

    try {
      // Process admins in batches to avoid too many simultaneous requests
      for (const adminId of admins) {
        // Skip if we already have the details for this admin
        if (adminDetails[adminId]) continue;

        try {
          const userData = await userService.getUserById(adminId);
          adminDetails[adminId] = userData;
        } catch (error) {
          console.error(`Error fetching details for admin ${adminId}:`, error);
          // Use a default object if we can't get the real user data
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
      // Fetch community details
      console.log(`Fetching community details for ID: ${communityId}`);
      const communityResponse = await CommunityService.getCommunityById(communityId);
      console.log('Community response:', communityResponse.data);
      
      const communityData = communityResponse.data;
      setCommunity(communityData);
      
      // Check if current user is a member or admin
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
        // Fetch members
        const membersResponse = await CommunityService.getCommunityMembers(communityId);
        console.log('Members response:', membersResponse.data);
        
        // Handle various response formats
        if (Array.isArray(membersResponse.data)) {
          setMembers(membersResponse.data);
        } else if (membersResponse.data && Array.isArray(membersResponse.data.content)) {
          setMembers(membersResponse.data.content);
        } else if (communityData.memberIds && Array.isArray(communityData.memberIds)) {
          // Fall back to memberIds from community data
          setMembers(communityData.memberIds);
        } else {
          console.log('No valid members data found');
          setMembers([]);
        }
      } catch (membersError) {
        console.error('Error fetching community members:', membersError);
        // Fall back to memberIds from community data
        setMembers(communityData.memberIds || []);
      }

      try {
        // Fetch admins
        const adminsResponse = await CommunityService.getCommunityAdmins(communityId);
        console.log('Admins response:', adminsResponse.data);
        
        // Handle various response formats
        if (Array.isArray(adminsResponse.data)) {
          setAdmins(adminsResponse.data);
        } else if (adminsResponse.data && Array.isArray(adminsResponse.data.content)) {
          setAdmins(adminsResponse.data.content);
        } else if (communityData.adminIds && Array.isArray(communityData.adminIds)) {
          // Fall back to adminIds from community data
          setAdmins(communityData.adminIds);
        } else {
          console.log('No valid admins data found');
          setAdmins([]);
        }
      } catch (adminsError) {
        console.error('Error fetching community admins:', adminsError);
        // Fall back to adminIds from community data
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
      const postsResponse = await CommunityService.getCommunityPosts(communityId, page, pageSize);
      console.log('Posts response:', postsResponse.data);
      
      // Handle different response formats
      if (postsResponse.data && postsResponse.data.content) {
        setPosts(postsResponse.data.content);
        setTotalPages(postsResponse.data.totalPages);
      } else if (Array.isArray(postsResponse.data)) {
        setPosts(postsResponse.data);
        setTotalPages(1);
      } else {
        console.log('No posts found or invalid response format');
        setPosts([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    if (!user) return;
    
    try {
      console.log(`User ${user.id} joining community ${communityId}`);
      await CommunityService.addMember(communityId, user.id);
      setIsMember(true);
      fetchCommunityDetails(); // Refresh community data
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user) return;
    
    try {
      console.log(`User ${user.id} leaving community ${communityId}`);
      await CommunityService.removeMember(communityId, user.id);
      setIsMember(false);
      setIsAdmin(false);
      fetchCommunityDetails(); // Refresh community data
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value - 1); // API pagination is 0-based, MUI Pagination is 1-based
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
        <CircularProgress sx={{ color: themeColors.accent }} size={50} thickness={4} />
        <Typography sx={{ mt: 2, color: themeColors.primary }}>Loading community...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <EmptyStatePaper elevation={0}>
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>{error}</Typography>
          <Button 
            variant="outlined" 
            onClick={fetchCommunityDetails}
            sx={{ 
              borderColor: themeColors.primary, 
              color: themeColors.primary,
              '&:hover': { 
                borderColor: themeColors.primary, 
                backgroundColor: alpha(themeColors.primary, 0.05) 
              }
            }}
          >
            Try Again
          </Button>
        </EmptyStatePaper>
      </Container>
    );
  }

  if (!community) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <EmptyStatePaper elevation={0}>
          <Typography variant="h4" sx={{ color: themeColors.primary, mb: 2 }}>Community not found</Typography>
          <Typography variant="body1" color="text.secondary">
            The community you're looking for might have been removed or is not accessible.
          </Typography>
        </EmptyStatePaper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <BannerPaper elevation={3}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {community.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryChip 
                  icon={<LocalOfferIcon />}
                  label={community.category || 'Uncategorized'} 
                  size="medium" 
                />
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  ml: 2,
                  color: alpha(themeColors.white, 0.85)
                }}>
                  <GroupIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  <Typography variant="body2">
                    {members ? members.length : 0} members
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ 
                mb: 3, 
                maxWidth: '80%',
                color: alpha(themeColors.white, 0.9)
              }}>
                {community.description || 'No description available'}
              </Typography>
            </Box>
            <Box>
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
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderColor: 'rgba(255, 255, 255, 0.5)'
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
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }} 
                />
              ))}
            </Stack>
          )}
        </Box>
      </BannerPaper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {isMember && (
            <SectionPaper sx={{ 
              mb: 3, 
              p: 0, 
              overflow: 'visible', 
              borderTop: `4px solid ${themeColors.accent}`
            }}>
              <Box sx={{ p: 3 }}>
                <CreatePostForm communityId={communityId} onPostCreated={fetchCommunityPosts} />
              </Box>
            </SectionPaper>
          )}

          {postsLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px' 
            }}>
              <CircularProgress sx={{ color: themeColors.accent }} />
            </Box>
          ) : posts.length > 0 ? (
            <>
              <PostsHeader>
                <SectionTitle variant="h6">
                  Community Posts
                </SectionTitle>
              </PostsHeader>
              
              {posts.map((post, index) => (
                <Box key={post.id} sx={{ mb: 3 }}>
                  <PostCard post={post} />
                </Box>
              ))}
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page + 1} 
                    onChange={handlePageChange} 
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: themeColors.primary
                      },
                      '& .Mui-selected': {
                        backgroundColor: alpha(themeColors.accent, 0.15),
                        color: themeColors.accent,
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: alpha(themeColors.accent, 0.25)
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <EmptyStatePaper elevation={0}>
              <Box sx={{ py: 4 }}>
                <Typography variant="h6" sx={{ color: themeColors.primary, mb: 1 }}>
                  No posts in this community yet
                </Typography>
                {isMember && (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Be the first to share your thoughts with the community!
                  </Typography>
                )}
                {isMember && (
                  <Button 
                    variant="contained" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    sx={{
                      backgroundColor: themeColors.accent,
                      color: themeColors.white,
                      '&:hover': {
                        backgroundColor: alpha(themeColors.accent, 0.85)
                      }
                    }}
                  >
                    Create a Post
                  </Button>
                )}
              </Box>
            </EmptyStatePaper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <SectionPaper>
            <SectionTitle variant="h6">
              <InfoItem>
                <InfoItem>
                  {community.isPublic ? (
                    <Tooltip title="Public Community">
                      <PublicIcon sx={{ color: themeColors.primary }} />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Private Community">
                      <LockIcon sx={{ color: themeColors.primary }} />
                    </Tooltip>
                  )}
                </InfoItem>
                Community Info
              </InfoItem>
            </SectionTitle>
            
            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 0 }}>
                <InfoItem>
                  <CalendarTodayIcon sx={{ color: themeColors.accent }} />
                  <Typography variant="body2">
                    <strong>Created:</strong> {formatDate(community.createdAt)}
                  </Typography>
                </InfoItem>
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <InfoItem>
                  <GroupIcon sx={{ color: themeColors.accent }} />
                  <Typography variant="body2">
                    <strong>Members:</strong> {members ? members.length : 0}
                  </Typography>
                </InfoItem>
              </ListItem>
              
              <ListItem sx={{ px: 0 }}>
                <InfoItem>
                  {community.isPublic ? (
                    <PublicIcon sx={{ color: themeColors.accent }} />
                  ) : (
                    <LockIcon sx={{ color: themeColors.accent }} />
                  )}
                  <Typography variant="body2">
                    <strong>Visibility:</strong> {community.isPublic ? 'Public' : 'Private'}
                  </Typography>
                </InfoItem>
              </ListItem>
            </List>
          </SectionPaper>

          <SectionPaper>
            <SectionTitle variant="h6">
              <SupervisorAccountIcon sx={{ color: themeColors.primary }} />
              Admins
            </SectionTitle>
            
            <Divider sx={{ mb: 2 }} />
            
            {admins && admins.length > 0 ? (
              <List disablePadding>
                {admins.map((adminId) => (
                  <StyledListItem key={adminId} disablePadding sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <StyledAvatar isadmin="true" src={detailedAdmins[adminId]?.profilePicture || ''}>
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
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary="Administrator"
                      secondaryTypographyProps={{ 
                        color: themeColors.accent,
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </StyledListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">No admins found</Typography>
            )}
          </SectionPaper>

          <SectionPaper>
            <SectionTitle variant="h6">
              <PeopleIcon sx={{ color: themeColors.primary }} />
              Members
            </SectionTitle>
            
            <Divider sx={{ mb: 2 }} />
            
            {membersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} sx={{ color: themeColors.accent }} />
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
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary={admins && admins.includes(memberId) ? 'Admin' : 'Member'} 
                      secondaryTypographyProps={{ 
                        color: admins && admins.includes(memberId) ? themeColors.accent : 'text.secondary',
                        fontWeight: admins && admins.includes(memberId) ? 500 : 400,
                        fontSize: '0.75rem'
                      }}
                    />
                  </StyledListItem>
                ))}
                {members.length > 5 && (
                  <Box sx={{ 
                    mt: 2, 
                    pt: 2, 
                    borderTop: `1px solid ${alpha(themeColors.primary, 0.1)}`,
                    textAlign: 'center'
                  }}>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: themeColors.primary,
                        fontWeight: 500
                      }}
                    >
                      +{members.length - 5} more members
                    </Typography>
                  </Box>
                )}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">No members yet</Typography>
            )}
          </SectionPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommunityFeed;