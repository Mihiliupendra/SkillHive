package com.example.demo.controller;



import com.example.demo.dto.CountResponse;
import com.example.demo.dto.NotificationResponse;
import com.example.demo.model.Notification;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<NotificationResponse> getNotifications(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all") String filter) {
        NotificationResponse response = notificationService.getNotifications(userId, page, size, filter);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String notificationId) {
        Notification notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@RequestBody UserIdRequest request) {
        notificationService.markAllAsRead(request.getUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<CountResponse> getUnreadCount(@RequestParam String userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(new CountResponse(count));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllNotifications(@RequestParam String userId) {
        notificationService.deleteAllNotifications(userId);
        return ResponseEntity.noContent().build();
    }

    // Inner class for request body
    private static class UserIdRequest {
        private String userId;

        public UserIdRequest() {
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }
}

