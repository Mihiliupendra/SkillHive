// src/services/websocketService.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_BASE_URL, WS_BASE_URL } from '../config';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
    this.connected = false;
    this.onConnectCallbacks = [];
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 3;
  }

  connect() {
    if (this.stompClient) {
      return;
    }

    // Get current user ID and token from local storage
    const userData = localStorage.getItem('user');
    let userId = '';
    let token = '';
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id || '';
        token = user.token || ''; // Get auth token if available
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }

    if (!userId) {
      console.error('No user ID available for WebSocket authentication');
      return;
    }

    // Use the API_BASE_URL (which is http/https) for SockJS instead of WS_BASE_URL
    // SockJS doesn't support the ws:// protocol directly, it wraps WebSockets
    const socketUrl = `${API_BASE_URL}/ws${token ? `?token=${token}` : ''}`;
    console.log('Connecting to WebSocket at:', socketUrl);
    
    // Create socket with token in query parameter to avoid CORS preflight
    const socket = new SockJS(socketUrl);
    
    // Create connection with authentication headers
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        'X-User-Id': userId,
        'Authorization': token ? `Bearer ${token}` : '' // Add Authorization header
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        this.connectionAttempts = 0;
        this.onConnectCallbacks.forEach(callback => callback());
        this.onConnectCallbacks = [];
        console.log('WebSocket connected successfully');
      },
      onDisconnect: () => {
        this.connected = false;
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
        this.handleConnectionError();
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error', event);
        this.handleConnectionError();
      }
    });

    this.stompClient.activate();
  }

  handleConnectionError() {
    this.connectionAttempts++;
    if (this.connectionAttempts < this.maxConnectionAttempts) {
      console.log(`Connection attempt ${this.connectionAttempts} failed, retrying...`);
      // Allow time before retrying
      setTimeout(() => {
        if (this.stompClient) {
          this.stompClient.deactivate();
          this.stompClient = null;
        }
        this.connect();
      }, 3000);
    } else {
      console.error(`Failed to connect after ${this.maxConnectionAttempts} attempts`);
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  onConnect(callback) {
    if (this.connected) {
      callback();
    } else {
      this.onConnectCallbacks.push(callback);
    }
  }

  subscribe(destination, callback) {
    if (!this.stompClient) {
      this.connect();
    }

    const subscribe = () => {
      const subscription = this.stompClient.subscribe(destination, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        } catch (e) {
          console.error('Error parsing message', e);
        }
      });
      this.subscriptions.set(destination, subscription);
    };

    if (this.connected) {
      subscribe();
    } else {
      this.onConnect(subscribe);
    }
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }
  
  // Add a method to send messages via WebSocket
  sendMessage(destination, body) {
    if (!this.connected || !this.stompClient) {
      console.warn('Cannot send message - not connected');
      return false;
    }
    
    try {
      this.stompClient.publish({
        destination: destination,
        body: typeof body === 'string' ? body : JSON.stringify(body)
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService;