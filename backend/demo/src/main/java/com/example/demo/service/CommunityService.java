package com.example.demo.service;

import com.example.demo.model.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface CommunityService {
    Page<Community> getAllCommunities(Pageable pageable);
    
    List<Community> getAllCommunities();
    
    Community createCommunity(Community community);
    
    Optional<Community> getCommunityById(String id);
    
    Optional<Community> getCommunityByName(String name);
    
    Optional<Community> updateCommunity(Community community);
    
    void deleteCommunity(String id);
    
    boolean addMember(String communityId, String userId);
    
    boolean removeMember(String communityId, String userId);
    
    boolean addAdmin(String communityId, String userId);
    
    boolean removeAdmin(String communityId, String userId);
    
    List<Community> getCommunitiesByMember(String userId);
    
    Page<Community> getCommunitiesByMember(String userId, Pageable pageable);
    
    List<Community> getCommunitiesByAdmin(String userId);
    
    Page<Community> getCommunitiesByAdmin(String userId, Pageable pageable);
    
    List<Community> getPublicCommunities();
    
    Page<Community> getPublicCommunities(Pageable pageable);
    
    List<Community> getCommunitiesByCategory(String category);
    
    Page<Community> getCommunitiesByCategory(String category, Pageable pageable);
    
    List<Community> getCommunitiesByTag(String tag);
    
    Page<Community> getCommunitiesByTag(String tag, Pageable pageable);
    
    Page<Community> getCommunitiesByNameContaining(String name, Pageable pageable);
    
    List<String> getCommunityMembers(String communityId);
    
    List<String> getCommunityAdmins(String communityId);
}