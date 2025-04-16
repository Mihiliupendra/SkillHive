package com.example.demo.repository;

import com.example.demo.model.Follow;
import com.example.demo.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowing(User following);
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
    boolean existsByFollowerAndFollowing(User follower, User following);
    void deleteByFollowerAndFollowing(User follower, User following);
    long countByFollower(User follower);
    long countByFollowing(User following);
    
    @Query("{ $or: [ { 'follower': ?0 }, { 'following': ?0 } ] }")
    List<Follow> findByFollowerOrFollowing(User user);
} 