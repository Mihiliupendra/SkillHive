package com.example.demo.service;



import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.CommentUpdateRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.Comment;
import com.example.demo.model.NotificationType;
import com.example.demo.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;
    private final PostService postService;

    @Autowired
    public CommentService(CommentRepository commentRepository, NotificationService notificationService, PostService postService) {
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
        this.postService = postService;
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .filter(comment -> !comment.isDeleted())
                .collect(Collectors.toList());
    }

    public long getCommentCount(String postId) {
        return commentRepository.countByPostId(postId);
    }

    @Transactional
    public Comment createComment(CommentRequest request) {
        // Check if the post exists
        String postOwnerId = postService.getPostOwner(request.getPostId());

        // Check if parent comment exists if provided
        if (request.getParentCommentId() != null && !request.getParentCommentId().isEmpty()) {
            commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        }

        Comment comment = new Comment(
                request.getPostId(),
                request.getUserId(),
                request.getUserName(),
                request.getContent(),
                request.getParentCommentId()
        );

        Comment savedComment = commentRepository.save(comment);

        // Send notification to post owner if it's not the same user
        if (!request.getUserId().equals(postOwnerId)) {
            String message = request.getUserName() + " commented on your post";
            String link = "/posts/" + request.getPostId() + "#comment-" + savedComment.getId();

            notificationService.createNotification(postOwnerId, message, NotificationType.COMMENT, link);
        }

        // If this is a reply, also notify the parent comment owner
        if (request.getParentCommentId() != null && !request.getParentCommentId().isEmpty()) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));

            if (!request.getUserId().equals(parentComment.getUserId()) && !parentComment.getUserId().equals(postOwnerId)) {
                String message = request.getUserName() + " replied to your comment";
                String link = "/posts/" + request.getPostId() + "#comment-" + savedComment.getId();

                notificationService.createNotification(parentComment.getUserId(), message, NotificationType.COMMENT, link);
            }
        }

        return savedComment;
    }

    @Transactional
    public Comment updateComment(String commentId, CommentUpdateRequest request, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // Check if the user is the owner of the comment
        if (!comment.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this comment");
        }

        comment.setContent(request.getContent());
        comment.setUpdatedAt(Instant.now());

        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // Check if the user is the owner of the comment or the post
        String postOwnerId = postService.getPostOwner(comment.getPostId());

        if (!comment.getUserId().equals(userId) && !postOwnerId.equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        // Soft delete the comment
        comment.setDeleted(true);
        comment.setContent("[This comment has been deleted]");
        commentRepository.save(comment);

        // Alternatively, for hard delete:
        // commentRepository.delete(comment);
    }
}

