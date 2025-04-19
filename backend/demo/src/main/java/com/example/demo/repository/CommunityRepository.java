package com.example.demo.repository;

import com.example.demo.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    Optional<Community> findByName(String name);
    
    List<Community> findByIsPublic(boolean isPublic);
    
    List<Community> findByMemberIdsContaining(String userId);
    
    List<Community> findByAdminIdsContaining(String userId);
    
    List<Community> findByCategory(String category);
    
    List<Community> findByTagsContaining(String tag);
    
    boolean existsByName(String name);
}