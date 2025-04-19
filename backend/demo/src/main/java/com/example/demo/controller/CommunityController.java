package com.example.demo.controller;

import com.example.demo.model.Community;
import com.example.demo.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    private final CommunityService communityService;

    @Autowired
    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/public")
    public ResponseEntity<List<Community>> getPublicCommunities() {
        return ResponseEntity.ok(communityService.getPublicCommunities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Community> getCommunityById(@PathVariable String id) {
        return communityService.getCommunityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<Community> getCommunityByName(@PathVariable String name) {
        return communityService.getCommunityByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Community>> getCommunitiesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(communityService.getCommunitiesByCategory(category));
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Community>> getCommunitiesByTag(@PathVariable String tag) {
        return ResponseEntity.ok(communityService.getCommunitiesByTag(tag));
    }

    @GetMapping("/member/{userId}")
    public ResponseEntity<List<Community>> getCommunitiesByMember(@PathVariable String userId) {
        return ResponseEntity.ok(communityService.getCommunitiesByMember(userId));
    }

    @GetMapping("/admin/{userId}")
    public ResponseEntity<List<Community>> getCommunitiesByAdmin(@PathVariable String userId) {
        return ResponseEntity.ok(communityService.getCommunitiesByAdmin(userId));
    }

    @PostMapping("/create")
    public ResponseEntity<Community> createCommunity(@RequestBody Community community) {
        if (community.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        return new ResponseEntity<>(communityService.createCommunity(community), HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Community> updateCommunity(@PathVariable String id, @RequestBody Community community) {
        if (!id.equals(community.getId())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            return ResponseEntity.ok(communityService.updateCommunity(community));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable String id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{communityId}/members/{userId}")
    public ResponseEntity<Void> addMember(@PathVariable String communityId, @PathVariable String userId) {
        boolean added = communityService.addMember(communityId, userId);
        return added ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{communityId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable String communityId, @PathVariable String userId) {
        boolean removed = communityService.removeMember(communityId, userId);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{communityId}/admins/{userId}")
    public ResponseEntity<Void> addAdmin(@PathVariable String communityId, @PathVariable String userId) {
        boolean added = communityService.addAdmin(communityId, userId);
        return added ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{communityId}/admins/{userId}")
    public ResponseEntity<Void> removeAdmin(@PathVariable String communityId, @PathVariable String userId) {
        boolean removed = communityService.removeAdmin(communityId, userId);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}