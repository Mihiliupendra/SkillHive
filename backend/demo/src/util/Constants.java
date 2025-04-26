package com.example.demo.util;
public class Constants {

    // Notification types
    public static final String NOTIFICATION_TYPE_LIKE = "LIKE";
    public static final String NOTIFICATION_TYPE_COMMENT = "COMMENT";
    public static final String NOTIFICATION_TYPE_REPLY = "REPLY";
    public static final String NOTIFICATION_TYPE_FOLLOW = "FOLLOW";
    public static final String NOTIFICATION_TYPE_COMMUNITY_JOIN = "COMMUNITY_JOIN";
    public static final String NOTIFICATION_TYPE_POST_SHARE = "POST_SHARE";

    // WebSocket destinations
    public static final String NOTIFICATION_DESTINATION_NEW = "/queue/notifications";
    public static final String NOTIFICATION_DESTINATION_UPDATES = "/queue/notifications/updates";
    public static final String NOTIFICATION_DESTINATION_ALL_READ = "/queue/notifications/all-read";
    public static final String NOTIFICATION_DESTINATION_UNREAD = "/queue/notifications/unread";
    public static final String NOTIFICATION_DESTINATION_COUNT = "/queue/notifications/count";
}