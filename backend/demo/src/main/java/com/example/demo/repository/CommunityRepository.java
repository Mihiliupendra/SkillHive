package com.example.demo.repository;

import com.example.demo.model.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    
    Optional<Community> findByName(String name);
    
    List<Community> findByIsPublic(boolean isPublic);
    
    Page<Community> findByIsPublic(boolean isPublic, Pageable pageable);
    
    List<Community> findByCategory(String category);
    
    Page<Community> findByCategory(String category, Pageable pageable);
    
    List<Community> findByTagsContaining(String tag);
    
    Page<Community> findByTagsContaining(String tag, Pageable pageable);
    
    List<Community> findByMemberIdsContaining(String userId);
    
    Page<Community> findByMemberIdsContaining(String userId, Pageable pageable);
    
    List<Community> findByAdminIdsContaining(String userId);
    
    Page<Community> findByAdminIdsContaining(String userId, Pageable pageable);
    
    Page<Community> findByNameContaining(String name, Pageable pageable);
}