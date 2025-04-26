package com.example.demo.controller;

import com.example.demo.dto.NotificationDTO;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class NotificationWebSocketController {

    private final NotificationService notificationService;

    /**
     * Fetch unread notifications for the connected user via WebSocket
     */
    @MessageMapping("/notifications/unread")
    @SendToUser("/queue/notifications/unread")
    public List<NotificationDTO> getUnreadNotifications(Principal principal) {
        return notificationService.getUnreadNotifications();
    }

    /**
     * Mark a notification as read via WebSocket
     */
    @MessageMapping("/notifications/mark-read")
    @SendToUser("/queue/notifications/marked")
    public NotificationDTO markNotificationAsRead(@Payload String notificationId, Principal principal) {
        notificationService.markAsReadWS(notificationId, principal.getName());
        // In a real app, you'd fetch and return the updated notification
        // Here we'll assume a client-side update
        return null;
    }

    /**
     * Get notification count via WebSocket
     */
    @MessageMapping("/notifications/count")
    @SendToUser("/queue/notifications/count")
    public Map<String, Long> getUnreadCount(Principal principal) {
        long count = notificationService.getUnreadCountWS(principal.getName());
        return Map.of("count", count);
    }
}