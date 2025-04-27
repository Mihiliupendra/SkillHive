package com.example.demo.service;



import com.example.demo.dto.CommentDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    CommentDTO createComment(CommentDTO commentDTO);
    CommentDTO replyToComment(String parentCommentId, CommentDTO replyDTO);
    CommentDTO updateComment(String commentId, CommentDTO commentDTO);
    void deleteComment(String commentId);
    Page<CommentDTO> getPostComments(String postId, Pageable pageable);
    long getCommentCount(String postId);
}
