package com.example.demo.repository;

import com.example.demo.model.CommunityFeedPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommunityFeedPostRepository extends MongoRepository<CommunityFeedPost, String> {
    // Find all posts for a specific community with pagination
    Page<CommunityFeedPost> findByCommunityIdOrderByTimestampDesc(String communityId, Pageable pageable);
    
    // Find all posts by a specific user
    List<CommunityFeedPost> findByUserIdOrderByTimestampDesc(String userId);
    
    // Find posts by type
    List<CommunityFeedPost> findByType(CommunityFeedPost.PostType type);
    
    // Find posts by community and type
    List<CommunityFeedPost> findByCommunityIdAndType(String communityId, CommunityFeedPost.PostType type);
    
    // Find posts related to a specific skill
    List<CommunityFeedPost> findBySkillOrderByTimestampDesc(String skill);
    
    // Find recent posts (within date range)
    List<CommunityFeedPost> findByTimestampBetweenOrderByTimestampDesc(
        LocalDateTime startDate, LocalDateTime endDate);
    
    // Count posts by community
    long countByCommunityId(String communityId);
    
    // Find posts with a specific user's reactions
    List<CommunityFeedPost> findByReactions_UserIdOrderByTimestampDesc(String userId);
}