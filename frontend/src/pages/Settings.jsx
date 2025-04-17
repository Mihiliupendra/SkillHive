import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import {
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
  Switch,
  Divider,
  Grid,
  FormControlLabel,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  Lock as LockIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobAlerts: true,
    messageNotifications: true,
    connectionRequests: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    try {
      await axios.delete(`/api/users/${user.id}/profile`);
      await logout();
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete account');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Implement password change logic
  };

  const handleNotificationChange = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked
    });
  };

  const handlePrivacyChange = (event) => {
    setPrivacy({
      ...privacy,
      [event.target.name]: event.target.checked
    });
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      <Paper className="p-6">
        <Typography variant="h6" className="text-[#002B5B] mb-4 flex items-center">
          <PersonIcon className="mr-2" /> Profile Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
            <Typography className="font-medium">{user?.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Username</Typography>
            <Typography className="font-medium">{user?.username}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
            <Typography className="font-medium">{user?.firstName} {user?.lastName}</Typography>
          </Grid>
        </Grid>
        <Button
          startIcon={<EditIcon />}
          variant="outlined"
          className="mt-4"
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
      </Paper>

      <Paper className="p-6">
        <Typography variant="h6" className="text-[#002B5B] mb-4 flex items-center">
          <LockIcon className="mr-2" /> Password
        </Typography>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#F7931E',
              '&:hover': {
                bgcolor: '#e07b0d'
              }
            }}
          >
            Update Password
          </Button>
        </form>
      </Paper>

      <Paper className="p-6">
        <Typography variant="h6" className="text-[#002B5B] mb-4 flex items-center" color="error">
          <DeleteIcon className="mr-2" /> Danger Zone
        </Typography>
        <Typography variant="body2" className="text-red-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete Account
        </Button>
      </Paper>
    </div>
  );

  const renderNotificationsTab = () => (
    <Paper className="p-6">
      <Typography variant="h6" className="text-[#002B5B] mb-4 flex items-center">
        <NotificationsIcon className="mr-2" /> Notification Preferences
      </Typography>
      <div className="space-y-4">
        <FormControlLabel
          control={
            <Switch
              checked={notifications.emailNotifications}
              onChange={handleNotificationChange}
              name="emailNotifications"
              color="secondary"
            />
          }
          label="Email Notifications"
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.jobAlerts}
              onChange={handleNotificationChange}
              name="jobAlerts"
              color="secondary"
            />
          }
          label="Job Alerts"
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.messageNotifications}
              onChange={handleNotificationChange}
              name="messageNotifications"
              color="secondary"
            />
          }
          label="Message Notifications"
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.connectionRequests}
              onChange={handleNotificationChange}
              name="connectionRequests"
              color="secondary"
            />
          }
          label="Connection Requests"
        />
      </div>
    </Paper>
  );

  const renderPrivacyTab = () => (
    <Paper className="p-6">
      <Typography variant="h6" className="text-[#002B5B] mb-4 flex items-center">
        <SecurityIcon className="mr-2" /> Privacy Settings
      </Typography>
      <div className="space-y-4">
        <FormControlLabel
          control={
            <Switch
              checked={privacy.showEmail}
              onChange={handlePrivacyChange}
              name="showEmail"
              color="secondary"
            />
          }
          label="Show email on profile"
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={privacy.showPhone}
              onChange={handlePrivacyChange}
              name="showPhone"
              color="secondary"
            />
          }
          label="Show phone number on profile"
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={privacy.allowMessages}
              onChange={handlePrivacyChange}
              name="allowMessages"
              color="secondary"
            />
          }
          label="Allow messages from non-connections"
        />
      </div>
    </Paper>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Typography variant="h4" component="h1" className="text-[#002B5B] mb-8 font-bold" gutterBottom>
          Settings
        </Typography>

        <Paper className="mb-6">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: '#002B5B',
                '&.Mui-selected': {
                  color: '#F7931E',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#F7931E',
              },
            }}
          >
            <Tab label="Account" icon={<PersonIcon />} />
            <Tab label="Notifications" icon={<NotificationsIcon />} />
            <Tab label="Privacy" icon={<SecurityIcon />} />
          </Tabs>
        </Paper>

        {activeTab === 0 && renderAccountTab()}
        {activeTab === 1 && renderNotificationsTab()}
        {activeTab === 2 && renderPrivacyTab()}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ color: '#dc2626', bgcolor: '#fee2e2', py: 2 }}>
            Delete Account Permanently
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Typography variant="body1" gutterBottom>
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </Typography>
            <Typography variant="body2" className="mt-4 mb-2">
              Please type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm:
            </Typography>
            <TextField
              fullWidth
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              error={!!error}
              helperText={error}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: '#fafafa' }}>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              sx={{ color: '#002B5B' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              color="error"
            >
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </motion.div>
  );
}