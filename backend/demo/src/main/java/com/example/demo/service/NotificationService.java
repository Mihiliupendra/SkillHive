package com.example.demo.service;



import com.example.demo.dto.NotificationResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Notification;
import com.example.demo.model.NotificationType;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final WebSocketService webSocketService;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, WebSocketService webSocketService) {
        this.notificationRepository = notificationRepository;
        this.webSocketService = webSocketService;
    }

    @Transactional
    public Notification createNotification(String userId, String message, NotificationType type, String link) {
        Notification notification = new Notification(userId, message, type, link);
        Notification savedNotification = notificationRepository.save(notification);

        // Send real-time notification via WebSocket
        webSocketService.sendNotification(savedNotification);

        return savedNotification;
    }

    public NotificationResponse getNotifications(String userId, int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationsPage;

        if ("unread".equals(filter)) {
            notificationsPage = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId, pageable);
        } else {
            notificationsPage = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }

        List<Notification> notifications = notificationsPage.getContent();
        boolean hasMore = notificationsPage.hasNext();
        long totalCount = notificationsPage.getTotalElements();

        return new NotificationResponse(notifications, hasMore, totalCount);
    }

    @Transactional
    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId, Pageable.unpaged()).getContent();

        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(unreadNotifications);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void deleteAllNotifications(String userId) {
        notificationRepository.deleteByUserId(userId);
    }
}

