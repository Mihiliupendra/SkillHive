import React, { useState, useContext } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Stack,
  CircularProgress,
  FormHelperText,
  Divider,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { CommunityService } from '../services/communityService';
import { AuthContext } from '../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Theme colors
const themeColors = {
  primary: '#002B5B',
  accent: '#F7931E',
  white: '#FFFFFF'
};

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 43, 91, 0.1)',
  border: `1px solid ${alpha(themeColors.primary, 0.1)}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '8px',
    backgroundColor: themeColors.accent
  }
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: themeColors.primary,
  marginBottom: theme.spacing(3),
  position: 'relative',
  paddingBottom: theme.spacing(2),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '3px',
    backgroundColor: themeColors.accent
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none'
}));

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: themeColors.accent,
  color: themeColors.white,
  '&:hover': {
    backgroundColor: alpha(themeColors.accent, 0.85),
    boxShadow: '0 4px 12px rgba(247, 147, 30, 0.25)'
  }
}));

const SecondaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: alpha(themeColors.primary, 0.1),
  color: themeColors.primary,
  '&:hover': {
    backgroundColor: alpha(themeColors.primary, 0.15)
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&.Mui-focused fieldset': {
      borderColor: themeColors.primary
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: themeColors.primary
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '8px',
  '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: themeColors.primary
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root.Mui-focused': {
    color: themeColors.primary
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: themeColors.primary,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2)
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: alpha(themeColors.primary, 0.1),
  color: themeColors.primary,
  fontWeight: 500,
  '& .MuiChip-deleteIcon': {
    color: themeColors.primary,
    '&:hover': {
      color: alpha(themeColors.primary, 0.7)
    }
  }
}));

const TagButton = styled(Button)(({ theme }) => ({
  minWidth: 'unset',
  padding: '6px 12px',
  borderRadius: '8px',
  backgroundColor: themeColors.primary,
  color: themeColors.white,
  '&:hover': {
    backgroundColor: alpha(themeColors.primary, 0.85)
  },
  '&.Mui-disabled': {
    backgroundColor: alpha(themeColors.primary, 0.4),
    color: alpha(themeColors.white, 0.7)
  }
}));

const CreateCommunity = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isPublic: true,
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete)
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Community name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Prepare the community data
      const communityData = {
        ...formData,
        createdBy: user.id,
        memberIds: [user.id],
        adminIds: [user.id],
        createdAt: new Date().toISOString()
      };
      
      const response = await CommunityService.createCommunity(communityData);
      
      // Redirect to the new community page
      navigate(`/community/${response.data.id}`);
    } catch (error) {
      console.error('Error creating community:', error);
      setError(error.response?.data?.message || 'Failed to create community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    'Technology', 'Business', 'Education', 'Arts', 'Health', 'Science', 
    'Sports', 'Entertainment', 'Social', 'Travel', 'Food', 'Other'
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <StyledPaper elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <GroupAddIcon sx={{ fontSize: 32, color: themeColors.accent, mr: 2 }} />
          <PageTitle variant="h4">
            Create a New Community
          </PageTitle>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Create a space where people with shared interests can connect, share, and grow together.
        </Typography>
        
        {error && (
          <Box sx={{ 
            backgroundColor: alpha('#f44336', 0.1), 
            p: 2, 
            borderRadius: 2,
            mb: 3 
          }}>
            <Typography color="error">
              {error}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ mb: 4 }} />
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <SectionTitle variant="h6">
            Basic Information
          </SectionTitle>
          
          <StyledTextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Community Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!validationErrors.name}
            helperText={validationErrors.name || "Choose a memorable name that reflects your community's purpose"}
            disabled={loading}
            placeholder="e.g., Web Development Enthusiasts"
          />
          
          <StyledTextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!validationErrors.description}
            helperText={validationErrors.description || "Describe what your community is about and what members can expect"}
            disabled={loading}
            placeholder="Tell potential members what makes your community special..."
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mt: 3 }}>
            <StyledFormControl fullWidth margin="normal" required error={!!validationErrors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <StyledSelect
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
                disabled={loading}
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </StyledSelect>
              {validationErrors.category ? (
                <FormHelperText>{validationErrors.category}</FormHelperText>
              ) : (
                <FormHelperText>Select a category that best fits your community</FormHelperText>
              )}
            </StyledFormControl>
            
            <StyledFormControl fullWidth margin="normal">
              <InputLabel id="visibility-label">Visibility</InputLabel>
              <StyledSelect
                labelId="visibility-label"
                id="isPublic"
                name="isPublic"
                value={formData.isPublic}
                label="Visibility"
                onChange={(e) => setFormData({...formData, isPublic: e.target.value})}
                disabled={loading}
              >
                <MenuItem value={true}>Public - Anyone can find and join</MenuItem>
                <MenuItem value={false}>Private - By invitation only</MenuItem>
              </StyledSelect>
              <FormHelperText>You can change this setting later</FormHelperText>
            </StyledFormControl>
          </Box>
          
          <Box sx={{ mt: 4, mb: 2 }}>
            <Divider />
          </Box>
          
          <SectionTitle variant="h6">
            Tags
          </SectionTitle>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add relevant tags to help others discover your community (optional)
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            backgroundColor: alpha(themeColors.primary, 0.05),
            borderRadius: '8px',
            padding: '8px 16px'
          }}>
            <StyledTextField
              id="tag"
              label="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
              size="small"
              disabled={loading}
              sx={{ 
                mr: 1,
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white'
                }
              }}
              placeholder="e.g., beginner-friendly"
            />
            <TagButton 
              variant="contained" 
              onClick={handleTagAdd}
              disabled={!newTag.trim() || loading}
              startIcon={<AddIcon />}
            >
              Add
            </TagButton>
          </Box>
          
          <Box sx={{ minHeight: '50px' }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <StyledChip 
                  key={tag} 
                  label={tag} 
                  onDelete={() => handleTagDelete(tag)}
                  disabled={loading}
                />
              ))}
            </Stack>
          </Box>
          
          <Box sx={{ mt: 5, pt: 3, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${alpha(themeColors.primary, 0.1)}` }}>
            <SecondaryButton
              variant="outlined"
              onClick={() => navigate('/communities')}
              disabled={loading}
              startIcon={<ArrowBackIcon />}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GroupAddIcon />}
            >
              {loading ? 'Creating...' : 'Create Community'}
            </PrimaryButton>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default CreateCommunity;