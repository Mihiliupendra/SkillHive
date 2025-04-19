import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import debounce from 'lodash/debounce';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchRef = useRef(null);

  // Navigation items configuration
  const navItems = useMemo(() => [
    { to: '/home', icon: 'home', label: 'Home', match: path => path === '/home' },
    { to: '/projects', icon: 'folder', label: 'Projects', match: path => path.startsWith('/projects') },
    { to: '/team', icon: 'groups', label: 'Team', match: path => path.startsWith('/team') },
    { to: '/post', icon: 'add_circle', label: 'Post', match: path => path.startsWith('/post') },
    { to: '/notification', icon: 'notifications', label: 'Notification', match: path => path.startsWith('/notification') }
  ], []);

  // Debounced search with cleanup
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const response = await axios.get(`/api/users/search?q=${encodeURIComponent(query)}`);
        setSearchResults(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error searching users:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search when navigating away
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      setSearchQuery('');
      setSearchResults([]);
    };
  }, [debouncedSearch]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-[#002B5B] fixed w-full top-0 z-50 shadow-lg">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Search */}
          <div className="flex items-center flex-1">
            <Link 
              to="/home" 
              className="flex-shrink-0 flex items-center space-x-2 group"
              aria-label="Home"
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                className="text-[#F7931E] text-3xl"
              >
                <i className="material-icons">hive</i>
              </motion.div>
              <motion.span 
                className="text-[#F7931E] text-xl font-bold tracking-wide"
                whileHover={{ scale: 1.05 }}
              >
                SKILL HIVE
              </motion.span>
            </Link>
            
            <motion.div 
              ref={searchRef}
              className="ml-4 sm:ml-8 flex-1 max-w-xl relative"
              animate={{ width: isSearchFocused ? '100%' : 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search people, projects, skills..."
                  className="w-full bg-white/90 rounded-full pl-5 pr-10 py-2 text-sm text-[#002B5B] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7931E] focus:bg-white shadow-sm"
                  onFocus={() => setIsSearchFocused(true)}
                  aria-label="Search"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#002B5B]/60">
                  {isSearching ? (
                    <motion.i 
                      className="material-icons"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      aria-hidden="true"
                    >
                      sync
                    </motion.i>
                  ) : (
                    <i className="material-icons" aria-hidden="true">search</i>
                  )}
                </div>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (searchQuery || searchResults.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                    role="menu"
                  >
                    {searchResults.length > 0 ? (
                      <div className="max-h-[400px] overflow-y-auto">
                        {searchResults.map((result) => (
                          <Link
                            key={result._id || result.id}
                            to={`/profile/${result._id || result.id}`}
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                            className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                            role="menuitem"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F7931E] to-[#002B5B] flex items-center justify-center text-white font-medium text-sm">
                              {result.firstName?.[0]}{result.lastName?.[0]}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-[#002B5B]">
                                {result.firstName} {result.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {result.username}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : searchQuery && !isSearching ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No results found
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Center section - Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-8 mx-4">
            {navItems.map((item) => (
              <NavLink 
                key={item.to}
                to={item.to}
                icon={item.icon}
                isActive={item.match(location.pathname)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right section - Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <motion.button 
                ref={buttonRef}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-white hover:bg-white/10 rounded-full p-1 pr-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Profile menu"
                aria-expanded={isProfileOpen}
              >
                <motion.div 
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#F7931E] to-[#002B5B] flex items-center justify-center text-white font-bold shadow-sm"
                  whileHover={{ rotate: 5 }}
                >
                  {user.username.substring(0, 2).toUpperCase()}
                </motion.div>
                <span className="text-sm font-medium hidden md:inline-block">
                  {user.username}
                </span>
                <motion.i 
                  className="material-icons text-sm"
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  aria-hidden="true"
                >
                  arrow_drop_down
                </motion.i>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    role="menu"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-[#002B5B]">{user.username}</p>
                      <p className="text-xs text-[#002B5B]/70 truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to={`/profile/${user.id}`} 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-[#002B5B] hover:bg-[#F7931E]/10 transition-colors"
                      role="menuitem"
                    >
                      <i className="material-icons text-[#F7931E] mr-3" aria-hidden="true">person</i>
                      <span>View Profile</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-[#002B5B] hover:bg-[#F7931E]/10 transition-colors"
                      role="menuitem"
                    >
                      <i className="material-icons text-[#F7931E] mr-3" aria-hidden="true">settings</i>
                      <span>Settings</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      role="menuitem"
                    >
                      <i className="material-icons text-red-600 mr-3" aria-hidden="true">logout</i>
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = React.memo(({ to, icon, children, isActive }) => {
  return (
    <Link 
      to={to}
      className={`flex flex-col items-center transition-all duration-200 ${isActive ? 'text-[#F7931E]' : 'text-white/80 hover:text-[#F7931E]'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative"
      >
        <i className="material-icons" aria-hidden="true">{icon}</i>
        {isActive && (
          <motion.span 
            className="absolute -bottom-1 left-1/2 w-1 h-1 bg-[#F7931E] rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          />
        )}
      </motion.div>
      <span className="text-xs mt-1">{children}</span>
    </Link>
  );
});

export default Navbar;