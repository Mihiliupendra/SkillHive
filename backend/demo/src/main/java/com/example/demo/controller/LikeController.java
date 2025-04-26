package com.example.demo.controller;


import com.example.demo.dto.LikeDTO;
import com.example.demo.model.Like;
import com.example.demo.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LikeDTO;
import com.example.demo.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<LikeDTO> likePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        LikeDTO likeDTO = likeService.likePost(postId, userId);
        return new ResponseEntity<>(likeDTO, HttpStatus.CREATED);
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> unlikePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        likeService.unlikePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}/check")
    public ResponseEntity<Map<String, Boolean>> checkLikeStatus(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        boolean hasLiked = likeService.hasUserLiked(postId, userId);
        return ResponseEntity.ok(Map.of("liked", hasLiked));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<LikeDTO>> getPostLikes(@PathVariable String postId) {
        List<LikeDTO> likes = likeService.getPostLikes(postId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable String postId) {
        long count = likeService.getLikeCount(postId);
        return ResponseEntity.ok(count);
    }
}
