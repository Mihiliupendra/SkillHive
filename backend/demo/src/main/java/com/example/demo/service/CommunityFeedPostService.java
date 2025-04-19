package com.example.demo.service;

import com.example.demo.model.CommunityFeedPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CommunityFeedPostService {
    CommunityFeedPost createPost(CommunityFeedPost post);
    
    Optional<CommunityFeedPost> getPostById(String id);
    
    Page<CommunityFeedPost> getCommunityPosts(String communityId, Pageable pageable);
    
    List<CommunityFeedPost> getUserPosts(String userId);
    
    CommunityFeedPost updatePost(CommunityFeedPost post);
    
    void deletePost(String id);
    
    boolean addReaction(String postId, String userId, String emoji);
    
    boolean removeReaction(String postId, String userId);
    
    List<CommunityFeedPost> getPostsByType(CommunityFeedPost.PostType type);
    
    List<CommunityFeedPost> getPostsBySkill(String skill);
    
    List<CommunityFeedPost> getRecentPosts(LocalDateTime startDate, LocalDateTime endDate);
    
    long getPostCountByCommunity(String communityId);
    
    List<CommunityFeedPost> getPostsUserReactedTo(String userId);
}