import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  Avatar, 
  Alert,
  Snackbar,
  CircularProgress,
  Button,
  Fade, 
  Zoom,
  Tooltip,
  styled
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';
import websocketService from '../../services/websocketService';
import { format } from 'date-fns';

// Define theme colors
const themeColors = {
  primary: '#002B5B',
  primaryDark: '#001B3A',
  accent: '#F7931E',
  white: '#FFFFFF',
  lightGray: '#f8f9fa',
  error: '#D32F2F',
  warning: '#ED6C02'
};

// Styled components
const ChatPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '70vh', // Limit maximum height to ensure visibility
  minHeight: '500px', // Reduced minimum height
  borderRadius: '16px',
  overflow: 'hidden',
  background: '#FFFFFF',
  boxShadow: '0 4px 16px rgba(0, 43, 91, 0.1)',
  border: '1px solid rgba(0, 43, 91, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 43, 91, 0.15)'
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.8),
  borderBottom: '1px solid rgba(0, 43, 91, 0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: themeColors.primary,
  color: themeColors.white,
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem'
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  border: `2px solid ${themeColors.white}`,
  boxShadow: '0 3px 8px rgba(0, 43, 91, 0.1)',
  backgroundColor: themeColors.primary,
  transition: 'all 0.2s ease',
}));

const MessageBox = styled(Box)(({ theme, isCurrentUser }) => ({
  maxWidth: '70%',
  width: 'auto',
  background: isCurrentUser 
    ? themeColors.primary
    : themeColors.lightGray,
  color: isCurrentUser ? themeColors.white : themeColors.primaryDark,
  padding: theme.spacing(1.5),
  borderRadius: isCurrentUser ? '15px 15px 0 15px' : '15px 15px 15px 0',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  transition: 'all 0.2s ease',
  border: isCurrentUser ? 'none' : '1px solid rgba(0, 43, 91, 0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  padding: '8px 16px',
  fontWeight: 600,
  textTransform: 'none',
  color: themeColors.white,
  border: `1px solid rgba(255, 255, 255, 0.5)`,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    border: `1px solid ${themeColors.white}`,
  }
}));

const InputBox = styled(Box)(({ theme, connectionError }) => ({
  padding: theme.spacing(1.5),
  borderTop: '1px solid rgba(0, 43, 91, 0.1)',
  display: 'flex',
  alignItems: 'center',
  background: connectionError ? 'rgba(237, 108, 2, 0.05)' : themeColors.white,
  transition: 'all 0.3s ease'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: themeColors.white,
    transition: 'all 0.2s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: themeColors.primary
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: themeColors.accent,
      borderWidth: 2
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 43, 91, 0.2)'
    }
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    fontSize: '1rem'
  }
}));

const LoadMoreButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  margin: '16px auto',
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  background: themeColors.white,
  border: '1px solid rgba(0, 43, 91, 0.2)',
  color: themeColors.primary,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(0, 43, 91, 0.05)',
    border: `1px solid ${themeColors.primary}`,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.5)',
    color: 'rgba(0, 43, 91, 0.5)'
  }
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  background: 'rgba(0, 43, 91, 0.02)',
  border: '1px dashed rgba(0, 43, 91, 0.2)',
  borderRadius: '12px',
  margin: '16px',
  padding: '32px 16px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(0, 43, 91, 0.04)'
  }
}));

const ChatMessage = ({ message, currentUserId }) => {
  const isCurrentUser = message.senderId === currentUserId;
  
  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
          mb: 3,
          width: '100%',
          transition: 'all 0.2s ease'
        }}
      >
        {!isCurrentUser && (
          <StyledAvatar 
            src={message.senderProfilePicture || '/images/Default Profile Pic.png'} 
            sx={{ mr: 1.5 }}
          />
        )}
        <MessageBox isCurrentUser={isCurrentUser}>
          {!isCurrentUser && (
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 0.5, 
                color: themeColors.primary,
                fontSize: '1rem'
              }}
            >
              {message.senderName}
            </Typography>
          )}
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.6,
              fontSize: '1rem',
              fontWeight: 400
            }}
          >
            {message.content}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'right',
              mt: 0.5,
              color: isCurrentUser ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 43, 91, 0.6)',
              fontSize: '0.75rem',
              fontWeight: 500
            }}
          >
            {message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : 'Sending...'}
          </Typography>
        </MessageBox>
        {isCurrentUser && (
          <StyledAvatar 
            src={message.senderProfilePicture || '/images/Default Profile Pic.png'} 
            sx={{ ml: 1.5 }}
          />
        )}
      </Box>
    </Zoom>
  );
};

const ChatBox = ({ communityId, sx }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isConnected, setIsConnected] = useState(websocketService.connected);

  // Monitor WebSocket connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(websocketService.connected);
      setConnectionError(!websocketService.connected);
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Fetch recent messages when component mounts
  useEffect(() => {
    if (communityId) {
      loadRecentMessages();
    }
    return () => {
      if (communityId) {
        chatService.unsubscribeFromCommunityChat(communityId);
      }
    };
  }, [communityId]);
  
  // Subscribe to WebSocket for real-time messages
  useEffect(() => {
    if (communityId) {
      if (!websocketService.connected) {
        websocketService.connect();
      }
      chatService.subscribeToCommunityChat(communityId, (newMessage) => {
        if (newMessage) {
          setMessages(prevMessages => {
            if (!prevMessages.some(msg => msg.id === newMessage.id)) {
              return [newMessage, ...prevMessages];
            }
            return prevMessages;
          });
        }
      });
    }
  }, [communityId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);
  
  const loadRecentMessages = async () => {
    try {
      setLoading(true);
      setLoadingError(false);
      const recentMessages = await chatService.getRecentCommunityMessages(communityId);
      if (Array.isArray(recentMessages)) {
        setMessages(recentMessages.reverse());
      } else {
        setMessages([]);
        console.error('Unexpected response format from recent messages', recentMessages);
      }
    } catch (error) {
      console.error('Error loading recent messages:', error);
      setLoadingError(true);
      showSnackbar('Failed to load messages. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const loadMoreMessages = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await chatService.getCommunityMessages(communityId, nextPage);
      if (!response || !response.content || response.content.length === 0) {
        setHasMore(false);
      } else {
        setMessages(prevMessages => [...prevMessages, ...response.content.reverse()]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
      showSnackbar('Failed to load more messages. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showSnackbar = (message, severity = 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage) return;
    
    const chatMessage = {
      communityId,
      senderId: user.id,
      senderName: user.username || user.name,
      content: message,
      senderProfilePicture: user.profilePicture,
      timestamp: new Date().toISOString()
    };

    const tempMessageId = `temp-${Date.now()}`;
    const tempMessage = { ...chatMessage, id: tempMessageId };
    
    setMessages(prevMessages => [tempMessage, ...prevMessages]);
    setMessage('');
    setSendingMessage(true);
    
    try {
      if (websocketService.connected) {
        chatService.sendMessageWs(chatMessage);
      } else {
        const savedMessage = await chatService.sendMessage(communityId, chatMessage);
        if (savedMessage) {
          setMessages(prevMessages => 
            prevMessages.map(msg => msg.id === tempMessageId ? savedMessage : msg)
          );
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showSnackbar('Failed to send message. Please try again.', 'error');
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempMessageId));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleRefreshConnection = () => {
    websocketService.disconnect();
    setTimeout(() => {
      websocketService.connect();
      loadRecentMessages();
    }, 1000);
  };

  return (
    <ChatPaper elevation={3} sx={{ ...sx }}>
      <HeaderBox>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ChatBubbleOutlineIcon sx={{ mr: 1, fontSize: '1.5rem' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: themeColors.white,
              letterSpacing: '0.2px',
              fontSize: '1.1rem'
            }}
          >
            Community Chat
          </Typography>
        </Box>
        <Box>
          {connectionError ? (
            <Tooltip title="Reconnect to chat server">
              <StyledButton 
                startIcon={<RefreshIcon />}
                onClick={handleRefreshConnection}
                size="small"
                variant="outlined"
                sx={{ py: 0.5, px: 1 }}
              >
                Reconnect
              </StyledButton>
            </Tooltip>
          ) : (
            <Tooltip title="Chat options">
              <IconButton 
                sx={{ 
                  color: themeColors.white,
                  '&:hover': { 
                    background: 'rgba(255, 255, 255, 0.2)' 
                  } 
                }}
                size="small"
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </HeaderBox>
      
      {connectionError && (
        <Fade in={connectionError}>
          <Alert 
            severity="success" 
            variant="filled"
            sx={{ 
              m: 1, 
              mb: 0,
              borderRadius: '8px',
              bgcolor: themeColors.warning,
              color: themeColors.white,
              py: 0.5,
              maxWidth: '100%',
              overflow: 'hidden',
              '& .MuiAlert-message': { 
                display: 'flex', 
                alignItems: 'center',
                width: '100%',
                fontWeight: 500,
                fontSize: '0.85rem',
                overflow: 'hidden'
              },
              '& .MuiAlert-icon': {
                color: themeColors.white
              }
            }}
          >            <Box sx={{ 
              overflow: 'hidden',
              maxWidth: '100%',
              width: '100%'
            }}>              
            <span style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                maxWidth: '100%',
                display: 'block'
              }}>
                Hey!!! Welcome Back 😊 Remember you’re doing better than you think. Don’t rush the process, just trust your grind. 🌱✨

            </span>
            </Box>
          </Alert>
        </Fade>
      )}
      
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
          p: 2,
          background: themeColors.white,
          minHeight: '260px', // Reduced minimum height
          maxHeight: '50vh',  // Added maximum height
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={32} sx={{ color: themeColors.accent }} />
          </Box>
        ) : loadingError && messages.length === 0 ? (
          <EmptyStateBox sx={{ p: 2, textAlign: 'center' }}>
            <Typography 
              sx={{ 
                mb: 1, 
                fontWeight: 600, 
                color: themeColors.primaryDark,
                fontSize: '0.9rem'
              }}
            >
              Failed to load messages
            </Typography>
            <StyledButton 
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadRecentMessages}
              sx={{
                borderColor: themeColors.primary,
                color: themeColors.primary,
                py: 0.5,
                px: 1,
                fontSize: '0.8rem',
                '&:hover': {
                  background: 'rgba(0, 43, 91, 0.05)',
                  borderColor: themeColors.accent
                }
              }}
            >
              Try Again
            </StyledButton>
          </EmptyStateBox>
        ) : messages.length === 0 ? (
          <EmptyStateBox sx={{ p: 2 }}>
            <ChatBubbleOutlineIcon 
              sx={{ 
                fontSize: 40, 
                mb: 1, 
                color: 'rgba(0, 43, 91, 0.7)' 
              }} 
            />
            <Typography 
              sx={{ 
                fontWeight: 600, 
                color: themeColors.primaryDark,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
            >
              No messages yet. Start the conversation!
            </Typography>
          </EmptyStateBox>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id || index}
                message={msg}
                currentUserId={user.id}
              />
            ))}
            
            {hasMore && (
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <LoadMoreButton
                  variant="outlined"
                  size="small"
                  onClick={loadMoreMessages}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={14} sx={{ color: themeColors.accent }} /> : <DownloadIcon />}
                  sx={{ py: 0.5, px: 2, fontSize: '0.8rem' }}
                >
                  {loading ? 'Loading...' : 'Load More Messages'}
                </LoadMoreButton>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>
      
      <InputBox 
        component="form"
        onSubmit={handleSendMessage}
        connectionError={connectionError}
        sx={{ p: 1.5 }}
      >
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder={connectionError ? "Chat in limited mode..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="small"
          disabled={sendingMessage}
          autoComplete="off"
        />
        <Tooltip title={message.trim() ? "Send message" : "Type a message first"}>
          <span>
            <IconButton
              type="submit"
              sx={{ 
                p: '8px',
                ml: 1,
                background: !message.trim() || sendingMessage 
                  ? 'rgba(0, 43, 91, 0.2)' 
                  : themeColors.accent,
                color: themeColors.white,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  background: !message.trim() || sendingMessage 
                    ? 'rgba(0, 43, 91, 0.3)' 
                    : 'rgba(247, 147, 30, 0.9)',
                }
              }}
              disabled={!message.trim() || sendingMessage}
            >
              {sendingMessage ? (
                <CircularProgress size={20} sx={{ color: themeColors.white }} />
              ) : (
                <SendIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </InputBox>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"          sx={{ 
            width: '100%', 
            borderRadius: '12px',
            bgcolor: snackbarSeverity === 'error' ? themeColors.error : themeColors.accent,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontWeight: 500,
            maxWidth: '90vw',
            overflow: 'hidden',
            '& .MuiAlert-message': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              wordWrap: 'break-word'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ChatPaper>
  );
};

export default ChatBox;