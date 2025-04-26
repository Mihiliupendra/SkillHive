package com.example.demo.service;



import com.example.demo.dto.NotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    NotificationDTO createNotification(String userId, String actorId, String actorName, String type, String referenceId, String content);
    Page<NotificationDTO> getUserNotifications( Pageable pageable);
    List<NotificationDTO> getUnreadNotifications();
    void markAsReadWS(String notificationId, String userId);
    void markAsReadAPI(String notificationId);
    void markAllAsRead();
    long getUnreadCountWS(String userId);
    long getUnreadCountAPI();
}

