package com.example.demo.service.impl;

import com.example.demo.dto.CommentDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.Comment;
import com.example.demo.repository.CommentRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.CommentService;
import com.example.demo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        UserPrincipal user = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = user.getId();
        String userDisplayName = user.getUsername();
        Comment comment = Comment.builder()
                .content(commentDTO.getContent())
                .postId(commentDTO.getPostId())
                .userId(userId)
                .userDisplayName(userDisplayName)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .deleted(false)
                .replies(new ArrayList<>())
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Notify post owner (assuming there's a way to get post owner ID)
        // This will be implemented in a real application by fetching post details
        // For now, let's assume we can get the post owner ID from somewhere
        String postOwnerId = "post-owner-id"; // This should be fetched from the Post service

        // Send notification only if commenter is not the post owner
        if (!userId.equals(postOwnerId)) {
            notificationService.createNotification(
                    postOwnerId,
                    userId,
                    userDisplayName,
                    "COMMENT",
                    savedComment.getPostId(),
                    userDisplayName + " commented on your post"
            );
        }

        return mapToDTO(savedComment);
    }

    @Override
    public CommentDTO replyToComment(String parentCommentId, CommentDTO replyDTO) {
        UserPrincipal user = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userId = user.getId();
        String userDisplayName = user.getUsername();
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));

        Comment reply = Comment.builder()
                .content(replyDTO.getContent())
                .postId(parentComment.getPostId())
                .userId(userId)
                .userDisplayName(userDisplayName)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .parentCommentId(parentCommentId)
                .deleted(false)
                .replies(new ArrayList<>())
                .build();

        Comment savedReply = commentRepository.save(reply);

        // Update parent comment with reply reference
        parentComment.getReplies().add(savedReply.getId());
        commentRepository.save(parentComment);

        // Notify the original commenter
        if (!userId.equals(parentComment.getUserId())) {
            notificationService.createNotification(
                    parentComment.getUserId(),
                    userId,
                    userDisplayName,
                    "REPLY",
                    parentComment.getId(),
                    userDisplayName + " replied to your comment"
            );
        }

        return mapToDTO(savedReply);
    }

    @Override
    public CommentDTO updateComment(String commentId, CommentDTO commentDTO) {
        UserPrincipal user = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(commentDTO.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updatedComment = commentRepository.save(comment);
        return mapToDTO(updatedComment);
    }

    @Override
    public void deleteComment(String commentId) {
        UserPrincipal user = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        String postOwnerId = "post-owner-id"; // This should be fetched from the Post service

        // Check if user is the comment owner or post owner
        if (!comment.getUserId().equals(user.getId()) && !postOwnerId.equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own comments or comments on your post");
        }

        // Soft delete
        comment.setDeleted(true);
        comment.setContent("This comment has been deleted");
        commentRepository.save(comment);
    }

    @Override
    public Page<CommentDTO> getPostComments(String postId, Pageable pageable) {
        Page<Comment> commentPage = commentRepository.findByPostIdAndParentCommentIdIsNull(postId, pageable);

        return commentPage.map(comment -> {
            CommentDTO dto = mapToDTO(comment);

            // Fetch and map replies for each top-level comment
            if (!comment.getReplies().isEmpty()) {
                List<CommentDTO> replyDTOs = comment.getReplies().stream()
                        .map(replyId -> commentRepository.findById(replyId).orElse(null))
                        .filter(Objects::nonNull)
                        .map(this::mapToDTO)
                        .collect(Collectors.toList());
                dto.setReplies(replyDTOs);
            } else {
                dto.setReplies(new ArrayList<>());
            }

            return dto;
        });
    }

    @Override
    public long getCommentCount(String postId) {
        return commentRepository.countByPostId(postId);
    }

    private CommentDTO mapToDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .postId(comment.getPostId())
                .userId(comment.getUserId())
                .userDisplayName(comment.getUserDisplayName())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .parentCommentId(comment.getParentCommentId())
                .deleted(comment.isDeleted())
                .build();
    }
}
