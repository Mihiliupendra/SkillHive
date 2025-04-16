import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Alert } from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', formData);
      
      if (response.data) {
        // Call the login function from AuthContext
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Paper className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#002B5B]">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          <div className="space-y-4">
            <TextField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="username"
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="text-[#F7931E] hover:text-[#002B5B]">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className="bg-[#002B5B] hover:bg-[#F7931E]"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-[#F7931E] hover:text-[#002B5B]">
              Sign up
            </Link>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export default SignIn; 