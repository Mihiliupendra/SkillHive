package com.example.demo.service.impl;

import com.example.demo.model.Community;
import com.example.demo.repository.CommunityRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityServiceImpl implements CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommunityServiceImpl(CommunityRepository communityRepository, UserRepository userRepository) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
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
    public Community updateCommunity(Community community) {
        // Make sure the community exists
        if (communityRepository.existsById(community.getId())) {
            return communityRepository.save(community);
        }
        throw new IllegalArgumentException("Community with ID " + community.getId() + " not found");
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
    public List<Community> getCommunitiesByAdmin(String userId) {
        return communityRepository.findByAdminIdsContaining(userId);
    }

    @Override
    public List<Community> getPublicCommunities() {
        return communityRepository.findByIsPublic(true);
    }

    @Override
    public List<Community> getCommunitiesByCategory(String category) {
        return communityRepository.findByCategory(category);
    }

    @Override
    public List<Community> getCommunitiesByTag(String tag) {
        return communityRepository.findByTagsContaining(tag);
    }
}