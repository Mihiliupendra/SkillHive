import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  Box, 
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Google, 
  Person,
  Visibility, 
  VisibilityOff,
  GitHub,
  Facebook
} from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', {
        username: formData.username,
        password: formData.password
      });
      
      if (response.data) {
        await login(response.data);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClickShowPassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setSocialLoading('google');
    try {
      const response = await api.post('/api/auth/google', {
        token: credentialResponse.credential,
      });
      await login(response.data);
      navigate('/home');
    } catch (err) {
      setError('Google sign-in failed');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Paper elevation={6} className="p-8 rounded-2xl shadow-xl bg-white">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-20 h-20 relative mb-4"
            >
              <img
                src="/Logo.png"
                alt="SkillHive Logo"
                className="w-full h-full"
              />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-3xl font-bold text-[#002B5B] mb-2"
            >
              SKILL HIVE
            </motion.h1>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Alert severity="error" className="rounded-lg">
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <TextField
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="Enter your username"
                InputProps={{
                  className: 'rounded-lg',
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <TextField
                label="Password"
                type={formData.showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="••••••••"
                InputProps={{
                  className: 'rounded-lg',
                  startAdornment: (
                    <InputAdornment position="start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="flex justify-end"
            >
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#F7931E] hover:text-[#002B5B] font-medium"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                className="py-3 rounded-lg bg-gradient-to-r from-[#F7931E] to-[#002B5B] hover:from-[#002B5B] hover:to-[#F7931E] text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} color="inherit" className="mr-2" />
                    Signing In...
                  </Box>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="my-6"
          >
            <Divider>
              <Typography variant="body2" className="text-gray-500 px-2">
                OR CONTINUE WITH
              </Typography>
            </Divider>
          </motion.div>

          {/* Social Sign In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="grid"
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed')}
              width="100%"
              shape="pill"
              theme="outline"
              text="signin_with"
              useOneTap
            />
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            className="mt-8 text-center"
          >
            <Typography variant="body2" className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-[#F7931E] hover:text-[#002B5B] font-medium"
              >
                Sign up
              </Link>
            </Typography>
          </motion.div>
        </Paper>

        {/* Terms and Conditions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="mt-6 text-center"
        >
          <Typography variant="caption" className="text-gray-500">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-[#F7931E] hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#F7931E] hover:underline">
              Privacy Policy
            </Link>
          </Typography>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignIn;