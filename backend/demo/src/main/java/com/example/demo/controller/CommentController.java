package com.example.demo.controller;


import com.example.demo.dto.CommentDTO;
import com.example.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
            @Valid @RequestBody CommentDTO commentDTO) {
        CommentDTO createdComment = commentService.createComment(commentDTO);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @PostMapping("/reply/{parentCommentId}")
    public ResponseEntity<CommentDTO> replyToComment(
            @PathVariable String parentCommentId,
            @Valid @RequestBody CommentDTO replyDTO) {
        CommentDTO createdReply = commentService.replyToComment(parentCommentId, replyDTO);
        return new ResponseEntity<>(createdReply, HttpStatus.CREATED);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable String commentId,
            @Valid @RequestBody CommentDTO commentDTO) {
        CommentDTO updatedComment = commentService.updateComment(commentId, commentDTO);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Page<CommentDTO>> getPostComments(
            @PathVariable String postId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<CommentDTO> comments = commentService.getPostComments(postId, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> getCommentCount(@PathVariable String postId) {
        long count = commentService.getCommentCount(postId);
        return ResponseEntity.ok(count);
    }
}
