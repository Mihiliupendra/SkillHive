package com.example.demo.dto;



import com.example.demo.model.Notification;

import java.util.List;

public class NotificationResponse {
    private List<Notification> notifications;
    private boolean hasMore;
    private long totalCount;

    public NotificationResponse() {
    }

    public NotificationResponse(List<Notification> notifications, boolean hasMore, long totalCount) {
        this.notifications = notifications;
        this.hasMore = hasMore;
        this.totalCount = totalCount;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public boolean isHasMore() {
        return hasMore;
    }

    public void setHasMore(boolean hasMore) {
        this.hasMore = hasMore;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }
}

