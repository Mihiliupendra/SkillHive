package com.example.demo.service;

import com.example.demo.dto.LikeDTO;

import java.util.List;

public interface LikeService {
    LikeDTO likePost(String postId);
    void unlikePost(String postId);
    boolean hasUserLiked(String postId);
    List<LikeDTO> getPostLikes(String postId);
    long getLikeCount(String postId);
}

