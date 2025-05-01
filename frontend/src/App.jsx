import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/profile/Profile';

import NotificationBell from "./components/Notification/NotificationBell.jsx"
import { useNotifications } from "./hooks/useNotifications.js"

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';
import Communities from './pages/Communities';
import CommunityFeed from './pages/CommunityFeed';
import Connections from './pages/Connections';



import NotificationList from './components/Notification/NotificationList';
import Dashboard from './components/Dashboard.jsx';
import AddProgress from './pages/AddProgress.jsx';
import Achievements from './pages/Achievements.jsx';
import Navbar from './components/Navbar.jsx';
import ProgressNavbar from './components/progress/ProgressNavbar.jsx';
import ProjectsLayout from './pages/ProjectsLayout.jsx';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-100">
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
                <ProjectsLayout />
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
                <NotificationList />
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
            path="/community/:communityId"
            element={
              <ProtectedRoute>
                <CommunityFeed />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
