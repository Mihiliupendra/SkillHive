package com.example.demo.websocket;



import com.example.demo.service.WebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Component
public class NotificationWebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(NotificationWebSocketHandler.class);

    private final WebSocketService webSocketService;

    @Autowired
    public NotificationWebSocketHandler(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = extractUserId(session);
        if (userId != null) {
            webSocketService.registerSession(userId, session);
            logger.info("WebSocket connection established for user: {}", userId);
        } else {
            logger.error("No userId provided in WebSocket connection");
            try {
                session.close(CloseStatus.BAD_DATA.withReason("No userId provided"));
            } catch (Exception e) {
                logger.error("Error closing WebSocket session", e);
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // This method handles incoming messages from clients
        // For our notification system, we don't need to process incoming messages
        // as notifications are pushed from the server to clients
        logger.debug("Received message from client: {}", message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        webSocketService.removeSession(session);
        logger.info("WebSocket connection closed: {}", status);
    }

    private String extractUserId(WebSocketSession session) {
        String query = session.getUri().getQuery();
        Map<String, String> queryParams = UriComponentsBuilder
                .newInstance()
                .query(query)
                .build()
                .getQueryParams()
                .toSingleValueMap();

        return queryParams.get("userId");
    }
}

