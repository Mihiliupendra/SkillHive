package com.example.demo.service;

import com.example.demo.dto.LikeDTO;

import java.util.List;

public interface LikeService {
    LikeDTO likePost(String postId, String userId);
    void unlikePost(String postId, String userId);
    boolean hasUserLiked(String postId, String userId);
    List<LikeDTO> getPostLikes(String postId);
    long getLikeCount(String postId);
}

