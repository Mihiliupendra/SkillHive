import React, { useEffect, useState, useContext } from 'react';
import { 
  Box, Button, Card, CardContent, Typography, Grid, 
  TextField, CircularProgress, Pagination, FormControl, 
  InputLabel, Select, MenuItem, Chip, Paper, Avatar,
  Container, CardMedia, CardActionArea, Divider, IconButton,
  InputAdornment, Badge
} from '@mui/material';
import CommunityService from '../services/communityService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { alpha } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Enhanced theme with your brand colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#002B5B',
      light: '#2D5B8C',
      dark: '#001A3A',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#F7931E',
      light: '#FFB04D',
      dark: '#C56E00',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F8FAFD',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#002B5B',
      secondary: '#5A6D87',
    }
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h3: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 43, 91, 0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          border: '1px solid rgba(0, 43, 91, 0.05)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 43, 91, 0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.7rem',
          height: 22,
          '& .MuiChip-label': {
            padding: '0 8px',
          }
        },
        colorPrimary: {
          backgroundColor: alpha('#002B5B', 0.1),
          color: '#002B5B',
        },
        colorSecondary: {
          backgroundColor: alpha('#F7931E', 0.1),
          color: '#F7931E',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: 0.5,
          borderRadius: 8,
        },
        containedPrimary: {
          padding: '6px 16px',
          boxShadow: '0 2px 8px rgba(0, 43, 91, 0.12)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 43, 91, 0.2)',
          },
        },
        containedSecondary: {
          padding: '6px 16px',
          boxShadow: '0 2px 8px rgba(247, 147, 30, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(247, 147, 30, 0.3)',
          },
        },
        outlinedPrimary: {
          padding: '6px 16px',
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        sizeSmall: {
          fontSize: '0.75rem',
          padding: '4px 12px',
        },
        sizeMedium: {
          fontSize: '0.8125rem',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
          },
          '& .MuiPaginationItem-page.Mui-selected': {
            backgroundColor: '#002B5B',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const Communities = () => {
  const [myCommunities, setMyCommunities] = useState([]);
  const [discoverCommunities, setDiscoverCommunities] = useState([]);
  const [loading, setLoading] = useState({ my: true, discover: true });
  const [page, setPage] = useState({ my: 0, discover: 0 });
  const [totalPages, setTotalPages] = useState({ my: 0, discover: 0 });
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    tag: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const pageSize = 6; // Reduced page size since we're showing two sections

  useEffect(() => {
    if (user) {
      fetchMyCommunities();
      fetchDiscoverCommunities();
    }
  }, [page.my, page.discover, filters, user]);

  const fetchMyCommunities = async () => {
    if (!user) return;
    setLoading(prev => ({ ...prev, my: true }));
    
    try {
      const apiFilters = {
        page: page.my,
        size: pageSize,
        memberId: user.id
      };

      if (filters.name) apiFilters.name = filters.name;
      if (filters.category) apiFilters.category = filters.category;
      if (filters.tag) apiFilters.tag = filters.tag;

      const response = await CommunityService.getCommunities(page.my, pageSize, apiFilters);
      
      if (response.data && Array.isArray(response.data.content)) {
        setMyCommunities(response.data.content);
        setTotalPages(prev => ({ ...prev, my: response.data.totalPages }));
      }
    } catch (error) {
      console.error('Error fetching my communities:', error);
      setMyCommunities([]);
      setTotalPages(prev => ({ ...prev, my: 0 }));
    } finally {
      setLoading(prev => ({ ...prev, my: false }));
    }
  };

  const fetchDiscoverCommunities = async () => {
    if (!user) return;
    setLoading(prev => ({ ...prev, discover: true }));
    
    try {
      const apiFilters = {
        page: page.discover,
        size: pageSize,
        excludeMemberId: user.id // Exclude communities user is already a member of
      };

      if (filters.name) apiFilters.name = filters.name;
      if (filters.category) apiFilters.category = filters.category;
      if (filters.tag) apiFilters.tag = filters.tag;

      const response = await CommunityService.getCommunities(page.discover, pageSize, apiFilters);
      
      if (response.data && Array.isArray(response.data.content)) {
        setDiscoverCommunities(response.data.content);
        setTotalPages(prev => ({ ...prev, discover: response.data.totalPages }));
      }
    } catch (error) {
      console.error('Error fetching discover communities:', error);
      setDiscoverCommunities([]);
      setTotalPages(prev => ({ ...prev, discover: 0 }));
    } finally {
      setLoading(prev => ({ ...prev, discover: false }));
    }
  };

  const handlePageChange = (section) => (event, value) => {
    setPage(prev => ({ ...prev, [section]: value - 1 }));
  };

  const handleJoin = async (communityId) => {
    if (!user) return;
    
    try {
      await CommunityService.addMember(communityId, user.id);
      const updatedCommunities = discoverCommunities.map(community => {
        if (community.id === communityId) {
          const updatedMemberIds = community.memberIds ? [...community.memberIds] : [];
          if (!updatedMemberIds.includes(user.id)) {
            updatedMemberIds.push(user.id);
          }
          return { ...community, memberIds: updatedMemberIds };
        }
        return community;
      });
      setDiscoverCommunities(updatedCommunities);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeave = async (communityId) => {
    if (!user) return;
    
    try {
      await CommunityService.removeMember(communityId, user.id);
      const updatedCommunities = myCommunities.map(community => {
        if (community.id === communityId && community.memberIds) {
          return { 
            ...community, 
            memberIds: community.memberIds.filter(id => id !== user.id) 
          };
        }
        return community;
      });
      setMyCommunities(updatedCommunities);
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const navigateToCommunity = (communityId) => {
    navigate(`/community/${communityId}`);
  };

  const isUserMember = (community) => {
    if (!user || !community) return false;
    return Array.isArray(community.memberIds) && community.memberIds.includes(user.id);
  };

  const isUserAdmin = (community) => {
    if (!user || !community) return false;
    return Array.isArray(community.adminIds) && community.adminIds.includes(user.id);
  };

  const categories = ['Technology', 'Business', 'Education', 'Health', 'Entertainment', 'Social', 'Other'];
  const tags = ['Programming', 'Marketing', 'Design', 'Finance', 'Science', 'Gaming', 'Sports'];

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const getCommunityInitials = (name) => {
    if (!name) return 'C';
    const words = name.split(' ');
    if (words.length === 1) return name.substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const renderCommunitySection = (title, description, communities, section, isLoading) => (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <GroupIcon sx={{ color: 'primary.main' }} />
        {title}
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ mb: 3 }}
      >
        {description}
      </Typography>

      {isLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px'
        }}>
          <CircularProgress size={40} thickness={4} />
        </Box>
      ) : (
        <>
          <Grid 
            container 
            spacing={3}
            justifyContent="flex-start"
          >
            {communities.length > 0 ? (
              communities.map((community) => (
                <Grid item xs={12} sm={6} md={4} key={community.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex', 
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'visible',
                      maxWidth: { xs: '100%', sm: 340 },
                      mx: 'auto',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0, 43, 91, 0.12)'
                      }
                    }}
                  >
                    {/* Community Avatar */}
                    <Avatar
                      sx={{
                        bgcolor: stringToColor(community.name),
                        width: 48,
                        height: 48,
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        position: 'absolute',
                        top: -12,
                        left: 12,
                        border: '3px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 2
                      }}
                    >
                      {getCommunityInitials(community.name)}
                    </Avatar>
                    
                    {/* Card Header/Background */}
                    <Box
                      sx={{
                        height: 40,
                        bgcolor: alpha(stringToColor(community.name + '1'), 0.1),
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        width: '100%'
                      }}
                    />
                    
                    <CardContent sx={{ flexGrow: 1, pt: 2, px: 2, pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" component="h2" gutterBottom noWrap sx={{ 
                          maxWidth: '80%', 
                          fontWeight: 600,
                          fontSize: '1rem'
                        }}>
                          {community.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {community.isPublic ? (
                            <Chip label="Public" color="success" size="small" />
                          ) : (
                            <Chip label="Private" color="default" size="small" />
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 1, display: 'flex', gap: 0.5 }}>
                        {isUserMember(community) && (
                          <Chip label="Joined" color="primary" size="small" />
                        )}
                        {isUserAdmin(community) && (
                          <Chip label="Admin" color="secondary" size="small" />
                        )}
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 1.5,
                          height: '3.6em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          fontSize: '0.8125rem'
                        }}
                      >
                        {community.description || 'No description available'}
                      </Typography>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontWeight: 500, 
                          fontSize: '0.75rem',
                          display: 'block',
                          mb: 0.5
                        }}>
                          Category: {community.category || 'Uncategorized'}
                        </Typography>
                        
                        {community.tags && community.tags.length > 0 && (
                          <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {community.tags.slice(0, 3).map(tag => (
                              <Chip 
                                key={tag} 
                                label={tag} 
                                size="small" 
                                variant="outlined" 
                                sx={{ 
                                  height: 20, 
                                  '& .MuiChip-label': { 
                                    fontSize: '0.7rem',
                                    px: 0.5
                                  } 
                                }} 
                              />
                            ))}
                            {community.tags.length > 3 && (
                              <Chip 
                                label={`+${community.tags.length - 3}`} 
                                size="small" 
                                variant="outlined" 
                                sx={{ 
                                  height: 20, 
                                  '& .MuiChip-label': { 
                                    fontSize: '0.7rem',
                                    px: 0.5
                                  } 
                                }} 
                              />
                            )}
                          </Box>
                        )}
                        
                        <Box 
                          sx={{ 
                            mt: 1, 
                            display: 'flex', 
                            alignItems: 'center',
                            color: 'primary.main',
                            fontSize: '0.75rem'
                          }}
                        >
                          <GroupIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                          <Typography variant="caption" fontWeight={500}>
                            {community.memberIds ? community.memberIds.length : 0} members
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <Divider />
                    
                    <Box sx={{ display: 'flex', p: 1, justifyContent: 'space-between' }}>
                      <Button 
                        variant="contained" 
                        size="small"
                        color="primary"
                        onClick={() => navigateToCommunity(community.id)}
                        sx={{ 
                          flex: '1 0 auto',
                          mr: 0.5,
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }}
                      >
                        View
                      </Button>
                      
                      {!isUserMember(community) ? (
                        <Button 
                          variant="outlined" 
                          size="small"
                          color="primary"
                          onClick={() => handleJoin(community.id)}
                          sx={{ 
                            fontWeight: 'medium', 
                            fontSize: '0.75rem',
                            minWidth: 'auto'
                          }}
                        >
                          Join
                        </Button>
                      ) : (
                        <Button 
                          variant="outlined" 
                          size="small"
                          color="error"
                          onClick={() => handleLeave(community.id)}
                          disabled={isUserAdmin(community) && community.adminIds?.length === 1}
                          sx={{ 
                            fontWeight: 'medium', 
                            fontSize: '0.75rem',
                            minWidth: 'auto'
                          }}
                        >
                          Leave
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    bgcolor: alpha(theme.palette.primary.light, 0.05),
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                      {section === 'my' ? 
                        "You haven't joined any communities yet" : 
                        "No communities found matching your criteria"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {section === 'my' ? 
                        "Join communities to connect with like-minded professionals and access exclusive content." : 
                        "Try adjusting your filters or create a new community to get started."}
                    </Typography>
                    {section === 'my' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowFilters(true)}
                        startIcon={<SearchIcon />}
                      >
                        Discover Communities
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>

          {totalPages[section] > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4
            }}>
              <Pagination 
                count={totalPages[section]} 
                page={page[section] + 1} 
                onChange={handlePageChange(section)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh',
        pt: 0,
        pb: 8
      }}>
        {/* Hero Section with gradient background */}
        <Box
          sx={{
            width: '100%',
            background: 'linear-gradient(135deg, #002B5B 0%, #1A4B7A 100%)',
            color: 'white',
            py: { xs: 5, md: 6 },
            mb: 5,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 20%, rgba(247, 147, 30, 0.15) 0%, transparent 60%)',
            }
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Discover Communities
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  maxWidth: '800px', 
                  mb: 4, 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  lineHeight: 1.6
                }}
              >
                Connect with professionals, share knowledge, and grow your network in our vibrant communities
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 2, 
                  alignItems: { xs: 'stretch', sm: 'center' },
                  maxWidth: 850
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search communities..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchCommunities()}
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                    sx: { 
                      bgcolor: alpha('#ffffff', 0.15), 
                      borderRadius: 12,
                      color: 'white',
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.25),
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& input::placeholder': {
                        color: alpha('#ffffff', 0.7),
                      }
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/create-community')}
                  startIcon={<AddIcon />}
                  sx={{
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px 0 rgba(247, 147, 30, 0.4)',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px 0 rgba(247, 147, 30, 0.5)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Create Community
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Filters Section - Centered with consistent width */}
          <Paper
            elevation={0}
            sx={{ 
              p: 2, 
              mb: 4, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0, 43, 91, 0.05)',
              width: '100%',
              maxWidth: 900,
              mx: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                <FilterListIcon color="primary" fontSize="small" /> Filter Communities
              </Typography>
              <Button 
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                color="primary"
                variant="outlined"
                sx={{
                  borderRadius: 8,
                  px: 2,
                  borderWidth: 1.5,
                  '&:hover': {
                    borderWidth: 1.5,
                  }
                }}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Box>

            {showFilters && (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                justifyContent: 'center'
              }}>
                <FormControl sx={{ minWidth: 180 }} size="small">
                  <InputLabel>Community Type</InputLabel>
                  <Select
                    value={filters.visibility}
                    label="Community Type"
                    onChange={(e) => handleFilterChange('visibility', e.target.value)}
                    sx={{ borderRadius: 8 }}
                  >
                    <MenuItem value="public">Public Communities</MenuItem>
                    <MenuItem value="category">By Category</MenuItem>
                    <MenuItem value="tag">By Tag</MenuItem>
                    <MenuItem value="member" disabled={!user}>My Memberships</MenuItem>
                    <MenuItem value="admin" disabled={!user}>Communities I Manage</MenuItem>
                  </Select>
                </FormControl>

                {filters.visibility === 'category' && (
                  <FormControl sx={{ minWidth: 180 }} size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filters.category}
                      label="Category"
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      sx={{ borderRadius: 8 }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {filters.visibility === 'tag' && (
                  <FormControl sx={{ minWidth: 180 }} size="small">
                    <InputLabel>Tag</InputLabel>
                    <Select
                      value={filters.tag}
                      label="Tag"
                      onChange={(e) => handleFilterChange('tag', e.target.value)}
                      sx={{ borderRadius: 8 }}
                    >
                      <MenuItem value="">All Tags</MenuItem>
                      {tags.map((tag) => (
                        <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            )}
          </Paper>

          {/* My Communities Section */}
          {renderCommunitySection(
            "My Communities",
            "Communities you've joined and are actively participating in",
            myCommunities,
            'my',
            loading.my
          )}

          {/* Divider */}
          <Divider sx={{ my: 6 }} />

          {/* Discover Section */}
          {renderCommunitySection(
            "Discover Communities",
            "Explore new communities that match your interests",
            discoverCommunities,
            'discover',
            loading.discover
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Communities;