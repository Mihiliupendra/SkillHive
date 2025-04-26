package com.example.demo.service.impl;
import com.example.demo.dto.NotificationDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @Override
    public NotificationDTO createNotification(String userId, String actorId, String actorName, String type,
                                              String referenceId, String content) {
        Notification notification = Notification.builder()
                .userId(userId)
                .actorId(actorId)
                .actorName(actorName)
                .type(type)
                .referenceId(referenceId)
                .content(content)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDTO notificationDTO = mapToDTO(savedNotification);

        // Send directly via WebSocket to the specific user
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                notificationDTO
        );

        return notificationDTO;
    }

    @Override
    public Page<NotificationDTO> getUserNotifications(Pageable pageable) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userPrincipal.getId();
        Page<Notification> notificationsPage = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return notificationsPage.map(this::mapToDTO);
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userPrincipal.getId();

        List<Notification> notifications = notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false);

        return notifications.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsReadWS(String notificationId, String userId) {  // for WebSocket
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot mark someone else's notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);

        // Send update via WebSocket that notification has been read
        NotificationDTO updatedNotification = mapToDTO(notification);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications/updates",
                updatedNotification
        );
    }

    @Override
    public void markAsReadAPI(String notificationId) {  // for API endpoint
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userPrincipal.getId();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot mark someone else's notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);

        // Send update via WebSocket that notification has been read
        NotificationDTO updatedNotification = mapToDTO(notification);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications/updates",
                updatedNotification
        );
    }

    @Override
    public void markAllAsRead() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userPrincipal.getId();
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false);

        unreadNotifications.forEach(notification -> notification.setRead(true));
        List<Notification> savedNotifications = notificationRepository.saveAll(unreadNotifications);

        // Send update via WebSocket that all notifications have been read
        if (!savedNotifications.isEmpty()) {
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications/all-read",
                    true
            );
        }
    }

    @Override
    public long getUnreadCountWS(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }


    @Override
    public long getUnreadCountAPI() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userPrincipal.getId();
        return notificationRepository.countByUserIdAndRead(userId, false);
    }

    private NotificationDTO mapToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .actorId(notification.getActorId())
                .actorName(notification.getActorName())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .content(notification.getContent())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }


}