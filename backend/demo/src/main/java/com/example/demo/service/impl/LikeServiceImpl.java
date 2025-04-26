package com.example.demo.service.impl;

import com.example.demo.dto.LikeDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Like;
import com.example.demo.repository.LikeRepository;
import com.example.demo.service.LikeService;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final NotificationService notificationService;

    @Override
    public LikeDTO likePost(String postId, String userId) {
        // Check if user already liked the post
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);

        if (existingLike.isPresent()) {
            return mapToDTO(existingLike.get());
        }

        Like like = Like.builder()
                .postId(postId)
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();

        Like savedLike = likeRepository.save(like);

        // Notify post owner (assuming there's a way to get post owner ID and user display name)
        String postOwnerId = "post-owner-id"; // This should be fetched from the Post service
        String userDisplayName = "User Name"; // This should be fetched from the User service

        // Send notification only if liker is not the post owner
        if (!userId.equals(postOwnerId)) {
            notificationService.createNotification(
                    postOwnerId,
                    userId,
                    userDisplayName,
                    "LIKE",
                    postId,
                    userDisplayName + " liked your post"
            );
        }

        return mapToDTO(savedLike);
    }

    @Override
    public void unlikePost(String postId, String userId) {
        likeRepository.deleteByPostIdAndUserId(postId, userId);
    }

    @Override
    public boolean hasUserLiked(String postId, String userId) {
        return likeRepository.findByPostIdAndUserId(postId, userId).isPresent();
    }

    @Override
    public List<LikeDTO> getPostLikes(String postId) {
        List<Like> likes = likeRepository.findByPostId(postId);
        return likes.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public long getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }

    private LikeDTO mapToDTO(Like like) {
        return LikeDTO.builder()
                .id(like.getId())
                .postId(like.getPostId())
                .userId(like.getUserId())
                .createdAt(like.getCreatedAt())
                .build();
    }
}

