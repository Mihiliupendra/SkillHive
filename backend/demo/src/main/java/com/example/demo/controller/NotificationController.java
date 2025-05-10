package com.example.demo.controller;


import com.example.demo.dto.NotificationDTO;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.http.CacheControl;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getUserNotifications(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<NotificationDTO> notifications = notificationService.getUserNotifications(pageable);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, java.util.concurrent.TimeUnit.SECONDS))
                .body(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications();
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, java.util.concurrent.TimeUnit.SECONDS))
                .body(notifications);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String notificationId) {
        notificationService.markAsReadAPI(notificationId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = notificationService.getUnreadCountAPI();
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(10, java.util.concurrent.TimeUnit.SECONDS))
                .body(Map.of("count", count));
    }
}
