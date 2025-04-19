package com.example.demo.service;

import com.example.demo.model.Community;
import java.util.List;
import java.util.Optional;

public interface CommunityService {
    List<Community> getAllCommunities();
    
    Community createCommunity(Community community);
    
    Optional<Community> getCommunityById(String id);
    
    Optional<Community> getCommunityByName(String name);
    
    Community updateCommunity(Community community);
    
    void deleteCommunity(String id);
    
    boolean addMember(String communityId, String userId);
    
    boolean removeMember(String communityId, String userId);
    
    boolean addAdmin(String communityId, String userId);
    
    boolean removeAdmin(String communityId, String userId);
    
    List<Community> getCommunitiesByMember(String userId);
    
    List<Community> getCommunitiesByAdmin(String userId);
    
    List<Community> getPublicCommunities();
    
    List<Community> getCommunitiesByCategory(String category);
    
    List<Community> getCommunitiesByTag(String tag);
}