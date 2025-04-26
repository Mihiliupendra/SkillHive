package com.example.demo.service;



import com.example.demo.dto.CommentDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    CommentDTO createComment(CommentDTO commentDTO, String userId, String userDisplayName);
    CommentDTO replyToComment(String parentCommentId, CommentDTO replyDTO, String userId, String userDisplayName);
    CommentDTO updateComment(String commentId, CommentDTO commentDTO, String userId);
    void deleteComment(String commentId, String userId);
    Page<CommentDTO> getPostComments(String postId, Pageable pageable);
    long getCommentCount(String postId);
}
