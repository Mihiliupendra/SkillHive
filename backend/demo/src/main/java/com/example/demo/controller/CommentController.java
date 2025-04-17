package com.example.demo.controller;



import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.CommentUpdateRequest;
import com.example.demo.dto.CountResponse;
import com.example.demo.model.Comment;
import com.example.demo.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CommentController {
    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/api/posts/{postId}/comments/count")
    public ResponseEntity<CountResponse> getCommentCount(@PathVariable String postId) {
        long count = commentService.getCommentCount(postId);
        return ResponseEntity.ok(new CountResponse(count));
    }

    @PostMapping("/api/comments")
    public ResponseEntity<Comment> createComment(@Valid @RequestBody CommentRequest request) {
        Comment comment = commentService.createComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String commentId,
            @Valid @RequestBody CommentUpdateRequest request,
            @RequestHeader("User-Id") String userId) {
        Comment comment = commentService.updateComment(commentId, request, userId);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            @RequestHeader("User-Id") String userId) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}

