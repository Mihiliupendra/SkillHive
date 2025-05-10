import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/profile/Profile';
import Footer from './components/Footer';


import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';
import Communities from './pages/Communities';
import CommunityFeed from './pages/CommunityFeed';
import Connections from './pages/Connections';
import CreateCommunity from './pages/CreateCommunity';


import { NotificationProvider } from './context/NotificationContext';
import NotificationIcon from './components/notifications/NotificationIcon';
import NotificationsPage from './pages/NotificationsPage';
import websocketService from './services/websocketService';
import ProjectsLayout from './pages/ProjectsLayout';
import { GoogleOAuthProvider } from '@react-oauth/google';


function AppContent() {
  const location = useLocation();
  const hideFooterPaths = ['/signin', '/signup'];
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/*"
            element={
              <ProtectedRoute>
                <ProjectsLayout/>
              </ProtectedRoute>
            }
          />
          {/* 🔁 Redirecting /team to /communities */}
          <Route
            path="/team"
            element={<Navigate to="/communities" replace />}
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <div>Reports Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/careers"
            element={
              <ProtectedRoute>
                <div>Careers Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                  <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <div>Calendar Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-network"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            }
          />
          {/*🚀 Communities */}
          <Route
            path="/communities"
            element={
              <ProtectedRoute>
                <Communities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-community"
            element={
              <ProtectedRoute>
                <CreateCommunity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community/:communityId"
            element={
              <ProtectedRoute>
                <CommunityFeed />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  // This is a placeholder. Replace with your new client ID from Google Cloud Console.
  // The client ID should match the one in your backend application.properties
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_NEW_CLIENT_ID_HERE.apps.googleusercontent.com";
  
  return (
     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
