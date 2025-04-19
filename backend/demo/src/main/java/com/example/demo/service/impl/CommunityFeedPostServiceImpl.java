package com.example.demo.service.impl;

import com.example.demo.model.CommunityFeedPost;
import com.example.demo.repository.CommunityFeedPostRepository;
import com.example.demo.repository.CommunityRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CommunityFeedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityFeedPostServiceImpl implements CommunityFeedPostService {

    private final CommunityFeedPostRepository postRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommunityFeedPostServiceImpl(
            CommunityFeedPostRepository postRepository,
            CommunityRepository communityRepository,
            UserRepository userRepository) {
        this.postRepository = postRepository;
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CommunityFeedPost createPost(CommunityFeedPost post) {
        // Validate community and user exist
        if (!communityRepository.existsById(post.getCommunityId())) {
            throw new IllegalArgumentException("Community not found");
        }
        if (!userRepository.existsById(post.getUserId())) {
            throw new IllegalArgumentException("User not found");
        }
        
        // Set timestamp if not provided
        if (post.getTimestamp() == null) {
            post.setTimestamp(LocalDateTime.now());
        }
        
        return postRepository.save(post);
    }

    @Override
    public Optional<CommunityFeedPost> getPostById(String id) {
        return postRepository.findById(id);
    }

    @Override
    public Page<CommunityFeedPost> getCommunityPosts(String communityId, Pageable pageable) {
        return postRepository.findByCommunityIdOrderByTimestampDesc(communityId, pageable);
    }

    @Override
    public List<CommunityFeedPost> getUserPosts(String userId) {
        return postRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    @Override
    public CommunityFeedPost updatePost(CommunityFeedPost post) {
        if (!postRepository.existsById(post.getId())) {
            throw new IllegalArgumentException("Post not found");
        }
        return postRepository.save(post);
    }

    @Override
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    @Override
    public boolean addReaction(String postId, String userId, String emoji) {
        Optional<CommunityFeedPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent() && userRepository.existsById(userId)) {
            CommunityFeedPost post = postOpt.get();
            
            // Check if user already reacted and remove previous reaction
            post.getReactions().removeIf(reaction -> reaction.getUserId().equals(userId));
            
            // Add new reaction
            CommunityFeedPost.Reaction reaction = new CommunityFeedPost.Reaction();
            reaction.setUserId(userId);
            reaction.setEmoji(emoji);
            reaction.setReactedAt(LocalDateTime.now());
            
            post.getReactions().add(reaction);
            postRepository.save(post);
            return true;
        }
        return false;
    }

    @Override
    public boolean removeReaction(String postId, String userId) {
        Optional<CommunityFeedPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            CommunityFeedPost post = postOpt.get();
            boolean removed = post.getReactions().removeIf(reaction -> reaction.getUserId().equals(userId));
            if (removed) {
                postRepository.save(post);
                return true;
            }
        }
        return false;
    }

    @Override
    public List<CommunityFeedPost> getPostsByType(CommunityFeedPost.PostType type) {
        return postRepository.findByType(type);
    }

    @Override
    public List<CommunityFeedPost> getPostsBySkill(String skill) {
        return postRepository.findBySkillOrderByTimestampDesc(skill);
    }

    @Override
    public List<CommunityFeedPost> getRecentPosts(LocalDateTime startDate, LocalDateTime endDate) {
        return postRepository.findByTimestampBetweenOrderByTimestampDesc(startDate, endDate);
    }

    @Override
    public long getPostCountByCommunity(String communityId) {
        return postRepository.countByCommunityId(communityId);
    }

    @Override
    public List<CommunityFeedPost> getPostsUserReactedTo(String userId) {
        return postRepository.findByReactions_UserIdOrderByTimestampDesc(userId);
    }
}