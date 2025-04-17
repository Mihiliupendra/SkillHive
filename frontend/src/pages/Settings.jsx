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
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    try {
      await axios.delete(`/api/users/${user.id}/profile`);
      // Log out the user after successful deletion
      await logout();
      // Redirect to home page
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Typography variant="h4" component="h1" className="text-[#002B5B] mb-8" gutterBottom>
          Account Settings
        </Typography>

        <Paper className="p-6 mb-6">
          <Typography variant="h6" className="text-[#002B5B] mb-4">
            Profile Information
          </Typography>
          <div className="space-y-4">
            <div>
              <Typography variant="subtitle2" color="textSecondary">Email</Typography>
              <Typography>{user?.email}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="textSecondary">Username</Typography>
              <Typography>{user?.username}</Typography>
            </div>
          </div>
        </Paper>

        <Paper className="p-6">
          <Typography variant="h6" className="text-[#002B5B] mb-4">
            Danger Zone
          </Typography>
          <Box className="border border-red-200 rounded-lg p-4 bg-red-50">
            <Typography variant="subtitle1" className="text-red-700 mb-2">
              Delete Account
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
          </Box>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: '#dc2626' }}>
            Delete Account Permanently
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </Typography>
            <Typography variant="body2" className="mt-4 mb-2">
              Please type <span className="font-mono font-bold">DELETE</span> to confirm:
            </Typography>
            <TextField
              fullWidth
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              error={!!error}
              helperText={error}
              variant="outlined"
              size="small"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
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
    </div>
  );
} 