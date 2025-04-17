package com.example.demo.service;



import com.example.demo.model.Notification;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WebSocketService {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketService.class);

    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    @Autowired
    public WebSocketService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void registerSession(String userId, WebSocketSession session) {
        userSessions.put(userId, session);
        logger.info("User {} connected. Total active sessions: {}", userId, userSessions.size());
    }

    public void removeSession(WebSocketSession session) {
        userSessions.entrySet().removeIf(entry -> entry.getValue().getId().equals(session.getId()));
        logger.info("Session removed. Total active sessions: {}", userSessions.size());
    }

    public void sendNotification(Notification notification) {
        WebSocketSession session = userSessions.get(notification.getUserId());

        if (session != null && session.isOpen()) {
            try {
                String notificationJson = objectMapper.writeValueAsString(notification);
                session.sendMessage(new TextMessage(notificationJson));
                logger.info("Notification sent to user {}", notification.getUserId());
            } catch (JsonProcessingException e) {
                logger.error("Error serializing notification", e);
            } catch (IOException e) {
                logger.error("Error sending notification to user {}", notification.getUserId(), e);
                userSessions.remove(notification.getUserId());
            }
        }
    }
}


