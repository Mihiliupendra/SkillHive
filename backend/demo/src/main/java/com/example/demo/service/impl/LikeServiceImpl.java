package com.example.demo.service.impl;


import com.example.demo.dto.LikeDTO;
import com.example.demo.model.Like;
import com.example.demo.model.User;
import com.example.demo.repository.LikeRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.LikeService;
import com.example.demo.service.NotificationService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;

    @Override
    public LikeDTO likePost(String postId) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userPrincipal.getId();
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
    public void unlikePost(String postId) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userPrincipal.getId();

        likeRepository.deleteByPostIdAndUserId(postId, userId);
    }

    @Override
    public boolean hasUserLiked(String postId) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = userPrincipal.getId();
        return likeRepository.findByPostIdAndUserId(postId, userId).isPresent();
    }

    @Override
    public List<LikeDTO> getPostLikes(String postId) {
        List<Like> likes = likeRepository.findByPostId(postId);
        List<LikeDTO> likeList = likes.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        for (LikeDTO likeDTO : likeList) {
            String userId = likeDTO.getUserId();
            String username = userRepository.findById(userId)
                    .map(User::getUsername)
                    .orElse("Unknown User");
            likeDTO.setUsername(username);
        }
        return likeList;
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



