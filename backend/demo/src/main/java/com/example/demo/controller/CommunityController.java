package com.example.demo.controller;

import com.example.demo.model.Community;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/communities")
public class CommunityController {

    private final CommunityService communityService;

    @Autowired
    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public ResponseEntity<Page<Community>> getCommunities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String visibility, // 👈 added for "public" filter
            @RequestParam(required = false) String memberId,
            @RequestParam(required = false) String adminId
    ) {
        PageRequest pageable = PageRequest.of(page, size);

        if (visibility != null && visibility.equalsIgnoreCase("public")) {
            return ResponseEntity.ok(communityService.getPublicCommunities(pageable));
        } else if (category != null) {
            return ResponseEntity.ok(communityService.getCommunitiesByCategory(category, pageable));
        } else if (tag != null) {
            return ResponseEntity.ok(communityService.getCommunitiesByTag(tag, pageable));
        } else if (name != null) {
            return ResponseEntity.ok(communityService.getCommunitiesByNameContaining(name, pageable));
        } else if (memberId != null) {
            return ResponseEntity.ok(communityService.getCommunitiesByMember(memberId, pageable));
        } else if (adminId != null) {
            return ResponseEntity.ok(communityService.getCommunitiesByAdmin(adminId, pageable));
        } else {
            return ResponseEntity.ok(communityService.getAllCommunities(pageable));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Community> getCommunity(@PathVariable String id) {
        return communityService.getCommunityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }    @PostMapping
    public ResponseEntity<Community> createCommunity(
            @Valid @RequestBody Community community,
            Authentication authentication) {        if (community.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // Set the creator as the current authenticated user
        if (!community.getAdminIds().contains(userPrincipal.getId())) {
            community.getAdminIds().add(userPrincipal.getId());
        }
        
        // Add creator to members if not already included
        if (!community.getMemberIds().contains(userPrincipal.getId())) {
            community.getMemberIds().add(userPrincipal.getId());
        }
        
        Community created = communityService.createCommunity(community);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Community> updateCommunity(
            @PathVariable String id,
            @Valid @RequestBody Community community) {
        if (!id.equals(community.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return communityService.updateCommunity(community)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable String id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{communityId}/members")
    public ResponseEntity<List<String>> getCommunityMembers(@PathVariable String communityId) {
        return ResponseEntity.ok(communityService.getCommunityMembers(communityId));
    }    @PostMapping("/{communityId}/members/me")
    public ResponseEntity<Void> addSelfAsMember(
            @PathVariable String communityId, 
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return communityService.addMember(communityId, userPrincipal.getId())
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{communityId}/members/{userId}")
    public ResponseEntity<Void> addMember(
            @PathVariable String communityId, 
            @PathVariable String userId,
            Authentication authentication) {
        // Only admins can add other members
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String currentUserId = userPrincipal.getId();
        
        // Check if current user is an admin
        if (!communityService.isAdmin(communityId, currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return communityService.addMember(communityId, userId)
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.notFound().build();
    }    @DeleteMapping("/{communityId}/members/me")
    public ResponseEntity<Void> removeSelfFromCommunity(
            @PathVariable String communityId,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return communityService.removeMember(communityId, userPrincipal.getId())
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{communityId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable String communityId, 
            @PathVariable String userId,
            Authentication authentication) {
        // Only admins can remove members or users can remove themselves
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String currentUserId = userPrincipal.getId();
        
        // Allow if current user is the one being removed or is an admin
        if (!currentUserId.equals(userId) && !communityService.isAdmin(communityId, currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return communityService.removeMember(communityId, userId)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/{communityId}/admins")
    public ResponseEntity<List<String>> getCommunityAdmins(@PathVariable String communityId) {
        return ResponseEntity.ok(communityService.getCommunityAdmins(communityId));
    }    @PostMapping("/{communityId}/admins/{userId}")
    public ResponseEntity<Void> addAdmin(
            @PathVariable String communityId, 
            @PathVariable String userId,
            Authentication authentication) {
        // Only existing admins can add new admins
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String currentUserId = userPrincipal.getId();
        
        // Check if current user is an admin
        if (!communityService.isAdmin(communityId, currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return communityService.addAdmin(communityId, userId)
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.notFound().build();
    }    @DeleteMapping("/{communityId}/admins/{userId}")
    public ResponseEntity<Void> removeAdmin(
            @PathVariable String communityId, 
            @PathVariable String userId,
            Authentication authentication) {
        // Only existing admins can remove admins (and cannot remove themselves if they're the last admin)
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String currentUserId = userPrincipal.getId();
        
        // Check if current user is an admin
        if (!communityService.isAdmin(communityId, currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Get all admins to ensure we're not removing the last admin
        List<String> admins = communityService.getCommunityAdmins(communityId);
        if (admins.size() <= 1 && admins.contains(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("X-Error-Message", "Cannot remove the last admin of a community")
                    .build();
        }
        
        return communityService.removeAdmin(communityId, userId)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
