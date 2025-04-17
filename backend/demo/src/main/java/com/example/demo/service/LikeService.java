package com.example.demo.service;



import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Like;
import com.example.demo.model.NotificationType;
import com.example.demo.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final NotificationService notificationService;
    private final PostService postService;

    @Autowired
    public LikeService(LikeRepository likeRepository, NotificationService notificationService, PostService postService) {
        this.likeRepository = likeRepository;
        this.notificationService = notificationService;
        this.postService = postService;
    }

    @Transactional
    public Like likePost(String postId, String userId) {
        // Check if the post exists
        String postOwnerId = postService.getPostOwner(postId);

        try {
            Like like = new Like(postId, userId);
            Like savedLike = likeRepository.save(like);

            // Send notification to post owner if it's not the same user
            if (!userId.equals(postOwnerId)) {
                String userName = getUserName(userId); // You would implement this method
                String message = userName + " liked your post";
                String link = "/posts/" + postId;

                notificationService.createNotification(postOwnerId, message, NotificationType.LIKE, link);
            }

            return savedLike;
        } catch (DuplicateKeyException e) {
            // User already liked the post
            return likeRepository.findByPostIdAndUserId(postId, userId)
                    .orElseThrow(() -> new IllegalStateException("Like should exist but was not found"));
        }
    }

    @Transactional
    public void unlikePost(String postId, String userId) {
        Like like = likeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found"));

        likeRepository.delete(like);
    }

    public long getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }

    public boolean hasUserLiked(String postId, String userId) {
        return likeRepository.findByPostIdAndUserId(postId, userId).isPresent();
    }

    // Helper method to get user name - in a real app, this would call a user service
    private String getUserName(String userId) {
        // This is a placeholder - in a real app, you would fetch the user's name from a user service
        return "User " + userId;
    }
}

