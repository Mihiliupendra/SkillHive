package com.example.demo.service.impl;

import com.example.demo.model.Community;
import com.example.demo.repository.CommunityRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CommunityService;
import com.example.demo.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityServiceImpl implements CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;

    @Autowired
    public CommunityServiceImpl(CommunityRepository communityRepository, UserRepository userRepository) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }
    
    @Override
    public Page<Community> getAllCommunities(Pageable pageable) {
        return communityRepository.findAll(pageable);
    }

    @Override
    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    @Override
    public Community createCommunity(Community community) {
        return communityRepository.save(community);
    }

    @Override
    public Optional<Community> getCommunityById(String id) {
        return communityRepository.findById(id);
    }

    @Override
    public Optional<Community> getCommunityByName(String name) {
        return communityRepository.findByName(name);
    }

    @Override
    public Optional<Community> updateCommunity(Community community) {
        if (communityRepository.existsById(community.getId())) {
            Community updated = communityRepository.save(community);
            return Optional.of(updated);
        }
        return Optional.empty();
    }

    @Override
    public void deleteCommunity(String id) {
        communityRepository.deleteById(id);
    }

    @Override
    public boolean addMember(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        if (communityOpt.isPresent() && userRepository.existsById(userId)) {
            Community community = communityOpt.get();
            community.getMemberIds().add(userId);
            communityRepository.save(community);

         // Notify all admins when a new member joins
        var user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            for (String adminId : community.getAdminIds()) {
                notificationService.createNotification(
                    adminId,
                    userId,
                    user.getUsername(), // actorName
                    "COMMUNITY_JOIN",
                    communityId,
                    user.getUsername() + " joined your community"
                );
            }
        }
            return true;
        }
        return false;
        
    }

    @Override
    public boolean removeMember(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            boolean removed = community.getMemberIds().remove(userId);
            if (removed) {
                communityRepository.save(community);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean addAdmin(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        if (communityOpt.isPresent() && userRepository.existsById(userId)) {
            Community community = communityOpt.get();
            // Make sure the user is a member first
            community.getMemberIds().add(userId);
            community.getAdminIds().add(userId);
            communityRepository.save(community);
            return true;
        }
        return false;
    }

    @Override
    public boolean removeAdmin(String communityId, String userId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        if (communityOpt.isPresent()) {
            Community community = communityOpt.get();
            boolean removed = community.getAdminIds().remove(userId);
            if (removed) {
                communityRepository.save(community);
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Community> getCommunitiesByMember(String userId) {
        return communityRepository.findByMemberIdsContaining(userId);
    }
    
    @Override
    public Page<Community> getCommunitiesByMember(String userId, Pageable pageable) {
        return communityRepository.findByMemberIdsContaining(userId, pageable);
    }

    @Override
    public List<Community> getCommunitiesByAdmin(String userId) {
        return communityRepository.findByAdminIdsContaining(userId);
    }
    
    @Override
    public Page<Community> getCommunitiesByAdmin(String userId, Pageable pageable) {
        return communityRepository.findByAdminIdsContaining(userId, pageable);
    }

    @Override
    public List<Community> getPublicCommunities() {
        return communityRepository.findByIsPublic(true);
    }
    
    @Override
    public Page<Community> getPublicCommunities(Pageable pageable) {
        return communityRepository.findByIsPublic(true, pageable);
    }

    @Override
    public List<Community> getCommunitiesByCategory(String category) {
        return communityRepository.findByCategory(category);
    }
    
    @Override
    public Page<Community> getCommunitiesByCategory(String category, Pageable pageable) {
        return communityRepository.findByCategory(category, pageable);
    }

    @Override
    public List<Community> getCommunitiesByTag(String tag) {
        return communityRepository.findByTagsContaining(tag);
    }
    
    @Override
    public Page<Community> getCommunitiesByTag(String tag, Pageable pageable) {
        return communityRepository.findByTagsContaining(tag, pageable);
    }
    
    @Override
    public Page<Community> getCommunitiesByNameContaining(String name, Pageable pageable) {
        return communityRepository.findByNameContaining(name, pageable);
    }
    
    @Override
    public List<String> getCommunityMembers(String communityId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        return communityOpt.map(community -> new ArrayList<>(community.getMemberIds())).orElse(new ArrayList<>());
    }
    
    @Override
    public List<String> getCommunityAdmins(String communityId) {
        Optional<Community> communityOpt = communityRepository.findById(communityId);
        return communityOpt.map(community -> new ArrayList<>(community.getAdminIds())).orElse(new ArrayList<>());
    }
}