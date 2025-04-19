import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Chip,
  Avatar,
  Paper,
  Divider,
  Container,
  CardMedia,
  IconButton
} from '@mui/material';
import CommunityService from '../services/communityService';
import { useAuth } from '../context/AuthContext';
import GroupIcon from '@mui/icons-material/Group';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExploreIcon from '@mui/icons-material/Explore';

const Communities = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const [allResponse, userResponse] = await Promise.all([
          CommunityService.getAllCommunities(),
          CommunityService.getUserCommunities(user.id)
        ]);
        
        setCommunities(allResponse.data);
        setUserCommunities(userResponse.data);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [user?.id]);

  const handleJoinCommunity = async (communityId) => {
    try {
      await CommunityService.joinCommunity(communityId, user.id);
      const updatedCommunity = communities.find(c => c.id === communityId);
      setUserCommunities(prev => [...prev, updatedCommunity]);
    } catch (err) {
      console.error('Error joining community:', err);
      setError('Failed to join community');
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      await CommunityService.leaveCommunity(communityId, user.id);
      setUserCommunities(prev => prev.filter(c => c.id !== communityId));
    } catch (err) {
      console.error('Error leaving community:', err);
      setError('Failed to leave community');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom>Welcome to Communities</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please log in to view and join communities
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/login">
            Log In
          </Button>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography variant="h5">Loading communities...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography variant="h5" color="error">{error}</Typography>
      </Box>
    );
  }

  const userCommunityIds = userCommunities.map(c => c.id);

  // Get community member counts (this would normally come from your API)
  const getCommunityMembers = (community) => {
    return community.memberCount || Math.floor(Math.random() * 100) + 5;
  };

  // Get community icon or initial letter
  const getCommunityIcon = (community) => {
    if (community.icon) return community.icon;
    return community.name.charAt(0).toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Communities
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Connect with like-minded developers and share your knowledge
        </Typography>
      </Box>
      
      {/* User Communities Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BookmarkIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            Your Communities
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {userCommunities.length > 0 ? (
          <Grid container spacing={3}>
            {userCommunities.map(community => (
              <Grid item xs={12} sm={6} md={4} key={community.id}>
                <CommunityCard 
                  community={community}
                  members={getCommunityMembers(community)}
                  icon={getCommunityIcon(community)}
                  onAction={() => handleLeaveCommunity(community.id)}
                  actionLabel="Leave"
                  color="error"
                  isMember={true}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              You haven't joined any communities yet
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<ExploreIcon />}
              href="#discover"
            >
              Discover Communities
            </Button>
          </Box>
        )}
      </Paper>

      {/* Discover Communities Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }} id="discover">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ExploreIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            Discover Communities
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {communities
            .filter(community => !userCommunityIds.includes(community.id))
            .map(community => (
              <Grid item xs={12} sm={6} md={4} key={community.id}>
                <CommunityCard
                  community={community}
                  members={getCommunityMembers(community)}
                  icon={getCommunityIcon(community)}
                  onAction={() => handleJoinCommunity(community.id)}
                  actionLabel="Join"
                  color="primary"
                  isMember={false}
                />
              </Grid>
            ))}
        </Grid>
      </Paper>
    </Container>
  );
};

// Enhanced Community Card Component
const CommunityCard = ({ community, members, icon, onAction, actionLabel, color, isMember }) => (
  <Card 
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 3,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6
      }
    }}
  >
    <Box 
      sx={{ 
        height: 100, 
        bgcolor: isMember ? 'primary.main' : 'secondary.main',
        position: 'relative'
      }}
    />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: -5,
      }}
    >
      <Avatar 
        sx={{ 
          width: 80, 
          height: 80, 
          bgcolor: isMember ? 'primary.dark' : 'secondary.dark',
          border: '4px solid white',
          fontSize: 28,
          fontWeight: 'bold'
        }}
      >
        {icon}
      </Avatar>
    </Box>
    
    <CardContent sx={{ pt: 2, flexGrow: 1 }}>
      <Typography 
        variant="h6" 
        component="h3" 
        align="center" 
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        {community.name}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Chip 
          icon={<GroupIcon fontSize="small" />} 
          label={`${members} members`} 
          size="small" 
          sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)' }}
        />
      </Box>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ mb: 2 }}
      >
        {community.description}
      </Typography>
    </CardContent>
    
    <CardActions sx={{ justifyContent: 'center', pb: 3, px: 2 }}>
      <Button 
        component={Link} 
        to={`/community/${community.id}`} 
        variant="outlined"
        fullWidth
        sx={{ mr: 1 }}
      >
        View Feed
      </Button>
      <Button 
        onClick={onAction} 
        variant="contained" 
        color={color}
        fullWidth
        sx={{ ml: 1 }}
      >
        {actionLabel}
      </Button>
    </CardActions>
  </Card>
);

export default Communities;