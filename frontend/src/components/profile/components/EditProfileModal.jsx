import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PROFESSIONAL_TITLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Scientist',
  'AI/ML Engineer',
  'Product Manager',
  'Project Manager',
  'UX Designer',
  'UI Designer',
  'Business Analyst',
  'Undergraduate Student',
  'Graduate Student',
  'Research Assistant',
  'Intern',
  'Other'
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  'Sri Lanka'
  // Add more countries as needed
];

const EditProfileModal = ({ open, onClose, user, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    professionalHeader: '',
    biography: '',
    country: '',
    city: ''
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        professionalHeader: user.professionalHeader || '',
        biography: user.biography || '',
        country: user.country || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Only include fields that have been changed
      const changedData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== (user[key] || '')) {
          changedData[key] = formData[key];
        }
      });
      
      if (Object.keys(changedData).length > 0) {
        await onSave(changedData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        bgcolor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" component="div" sx={{ color: '#002B5B', fontWeight: 'bold' }}>
          Edit Profile
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: '#002B5B',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{ flex: 1 }}
                placeholder={user?.firstName || 'First Name'}
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{ flex: 1 }}
                placeholder={user?.lastName || 'Last Name'}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel id="professional-header-label">Professional Header</InputLabel>
              <Select
                labelId="professional-header-label"
                name="professionalHeader"
                value={formData.professionalHeader}
                onChange={handleChange}
                label="Professional Header"
              >
                {PROFESSIONAL_TITLES.map((title) => (
                  <MenuItem key={title} value={title}>
                    {title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  label="Country"
                >
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Box>

            <TextField
              name="biography"
              label="About"
              value={formData.biography}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Tell us about yourself..."
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Button 
            onClick={onClose}
            sx={{ 
              color: '#002B5B',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#F7931E',
              '&:hover': {
                bgcolor: '#e07b0d'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileModal; 