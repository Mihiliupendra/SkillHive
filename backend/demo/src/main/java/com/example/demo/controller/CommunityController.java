package com.example.demo.controller;

import com.example.demo.model.Community;
import com.example.demo.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

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
    public ResponseEntity<EntityModel<Community>> getCommunity(@PathVariable String id) {
        return communityService.getCommunityById(id)
                .map(community -> {
                    EntityModel<Community> model = EntityModel.of(community);
                    model.add(linkTo(methodOn(CommunityController.class).getCommunity(id)).withSelfRel());
                    model.add(linkTo(methodOn(CommunityController.class).getCommunities(0,10,null,null,null,null,null,null)).withRel("all-communities"));
                    model.add(linkTo(methodOn(CommunityController.class).getCommunityMembers(id)).withRel("members"));
                    model.add(linkTo(methodOn(CommunityController.class).getCommunityAdmins(id)).withRel("admins"));
                    return ResponseEntity.ok(model);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EntityModel<Community>> createCommunity(@Valid @RequestBody Community community) {
        if (community.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        Community created = communityService.createCommunity(community);
        EntityModel<Community> model = EntityModel.of(created);
        model.add(linkTo(methodOn(CommunityController.class).getCommunity(created.getId())).withSelfRel());
        return ResponseEntity.status(HttpStatus.CREATED).body(model);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Community>> updateCommunity(
            @PathVariable String id,
            @Valid @RequestBody Community community) {
        if (!id.equals(community.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return communityService.updateCommunity(community)
                .map(updated -> {
                    EntityModel<Community> model = EntityModel.of(updated);
                    model.add(linkTo(methodOn(CommunityController.class).getCommunity(id)).withSelfRel());
                    return ResponseEntity.ok(model);
                })
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
    }

    @PostMapping("/{communityId}/members/{userId}")
    public ResponseEntity<Void> addMember(@PathVariable String communityId, @PathVariable String userId) {
        return communityService.addMember(communityId, userId)
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{communityId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable String communityId, @PathVariable String userId) {
        return communityService.removeMember(communityId, userId)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/{communityId}/admins")
    public ResponseEntity<List<String>> getCommunityAdmins(@PathVariable String communityId) {
        return ResponseEntity.ok(communityService.getCommunityAdmins(communityId));
    }

    @PostMapping("/{communityId}/admins/{userId}")
    public ResponseEntity<Void> addAdmin(@PathVariable String communityId, @PathVariable String userId) {
        return communityService.addAdmin(communityId, userId)
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{communityId}/admins/{userId}")
    public ResponseEntity<Void> removeAdmin(@PathVariable String communityId, @PathVariable String userId) {
        return communityService.removeAdmin(communityId, userId)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
