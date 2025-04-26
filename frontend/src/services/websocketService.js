// src/services/websocketService.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
    this.connected = false;
    this.onConnectCallbacks = [];
  }

  connect() {
    if (this.stompClient) {
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        this.connected = true;
        this.onConnectCallbacks.forEach(callback => callback());
        this.onConnectCallbacks = [];
        console.log('WebSocket connected');
      },
      onDisconnect: () => {
        this.connected = false;
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      }
    });

    this.stompClient.activate();
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
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService;