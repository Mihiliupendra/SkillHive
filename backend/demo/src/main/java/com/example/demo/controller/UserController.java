package com.example.demo.controller;

import com.example.demo.model.FriendRequest;
import com.example.demo.model.User;
import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.PaginatedResponse;
import com.example.demo.dto.UserDTO;
import com.example.demo.dto.UserProfileDTO;
import com.example.demo.dto.SignupRequest;
import com.example.demo.service.UserService;
import com.example.demo.repository.FollowRepository;
import com.example.demo.repository.FriendshipRepository;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.service.ImageUploadService;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.dto.ProfileCompletionDto;
import org.springframework.security.core.Authentication;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;
    private final FollowRepository followRepository;
    private final FriendshipRepository friendshipRepository;
    private final ImageUploadService imageUploadService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            userService.registerUser(signUpRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@PathVariable String userId, @RequestBody User updatedUser) {
        User user = userService.updateProfile(userId, updatedUser);
        // Get the authenticated user's ID (for now using the same userId)
        User currentUser = userService.getUserProfile(userId);
        return ResponseEntity.ok(UserProfileDTO.fromUserWithRelation(user, currentUser, followRepository, friendshipRepository));
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable String userId) {
        User user = userService.getUserProfile(userId);
        // Get the authenticated user's ID (for now using the same userId)
        User currentUser = userService.getUserProfile(userId);
        return ResponseEntity.ok(UserProfileDTO.fromUserWithRelation(user, currentUser, followRepository, friendshipRepository));
    }

    @PostMapping("/{userId}/follow/{userToFollowId}")
    public ResponseEntity<Void> followUser(@PathVariable String userId, @PathVariable String userToFollowId) {
        userService.followUser(userId, userToFollowId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/unfollow/{userToUnfollowId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId, @PathVariable String userToUnfollowId) {
        try {
            userService.unfollowUser(userId, userToUnfollowId);
            return ResponseEntity.ok(new MessageResponse("Successfully unfollowed user"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<PaginatedResponse<UserDTO>> getFollowers(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        User currentUser = userService.getUserProfile(userId);
        List<User> followers = userService.getFollowers(userId);
        long total = followers.size();
        
        // Apply pagination
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, followers.size());
        List<UserDTO> followerDTOs = followers.subList(start, end).stream()
                .map(user -> UserDTO.fromUserWithRelation(user, currentUser, followRepository, friendshipRepository))
                .collect(Collectors.toList());

        return ResponseEntity.ok(PaginatedResponse.success(followerDTOs, page, limit, total));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UserDTO>> getFollowing(@PathVariable String userId) {
        List<User> following = userService.getFollowing(userId);
        List<UserDTO> followingDTOs = following.stream()
                .map(user -> UserDTO.fromUser(user, followRepository, friendshipRepository))
                .collect(Collectors.toList());
        return ResponseEntity.ok(followingDTOs);
    }

    @PostMapping("/{senderId}/friend-request/{receiverId}")
    public ResponseEntity<?> sendFriendRequest(@PathVariable String senderId, @PathVariable String receiverId) {
        try {
            userService.sendFriendRequest(senderId, receiverId);
            return ResponseEntity.ok(new MessageResponse("Friend request sent."));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/friend-requests/{requestId}/accept")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable String requestId) {
        try {
            userService.acceptFriendRequest(requestId);
            return ResponseEntity.ok(new MessageResponse("Friend request accepted."));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/friend-requests/{requestId}/decline")
    public ResponseEntity<?> declineFriendRequest(@PathVariable String requestId) {
        try {
            userService.declineFriendRequest(requestId);
            return ResponseEntity.ok(new MessageResponse("Friend request declined."));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{userId}/friends")
    public ResponseEntity<PaginatedResponse<UserDTO>> getFriends(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        User currentUser = userService.getUserProfile(userId);
        List<User> friends = userService.getFriends(userId);
        long total = friends.size();
        
        // Apply pagination
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, friends.size());
        List<UserDTO> friendDTOs = friends.subList(start, end).stream()
                .map(user -> UserDTO.fromUserWithRelation(user, currentUser, followRepository, friendshipRepository))
                .collect(Collectors.toList());

        return ResponseEntity.ok(PaginatedResponse.success(friendDTOs, page, limit, total));
    }

    @GetMapping("/{userId1}/mutual-friends/{userId2}")
    public ResponseEntity<List<UserDTO>> getMutualFriends(@PathVariable String userId1, @PathVariable String userId2) {
        List<User> mutualFriends = userService.getMutualFriends(userId1, userId2);
        List<UserDTO> mutualFriendDTOs = mutualFriends.stream()
                .map(user -> UserDTO.fromUser(user, followRepository, friendshipRepository))
                .collect(Collectors.toList());
        return ResponseEntity.ok(mutualFriendDTOs);
    }

    @GetMapping("/{userId}/friend-requests/sent")
    public ResponseEntity<List<FriendRequest>> getPendingSentFriendRequests(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getPendingSentFriendRequests(userId));
    }

    @GetMapping("/{userId}/friend-requests/received")
    public ResponseEntity<List<FriendRequest>> getPendingReceivedFriendRequests(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getPendingReceivedFriendRequests(userId));
    }

    @DeleteMapping("/{userId}/profile")
    public ResponseEntity<?> deleteProfile(@PathVariable String userId) {
        try {
            userService.deleteProfile(userId);
            return ResponseEntity.ok(new MessageResponse("Profile deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{senderId}/friend-request/{receiverId}")
    public ResponseEntity<?> cancelFriendRequest(
            @PathVariable String senderId,
            @PathVariable String receiverId) {
        try {
            userService.cancelFriendRequest(senderId, receiverId);
            return ResponseEntity.ok(new MessageResponse("Friend request cancelled successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageUploadService.uploadImage(file, "profile-pictures");
            User user = userService.getUserProfile(userId);
            
            // Delete old profile picture if exists
            if (user.getProfilePicture() != null) {
                imageUploadService.deleteImage(user.getProfilePicture());
            }
            
            user.setProfilePicture(imageUrl);
            User updatedUser = userService.updateProfile(userId, user);
            return ResponseEntity.ok(UserProfileDTO.fromUser(updatedUser, followRepository, friendshipRepository));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/{userId}/cover-photo")
    public ResponseEntity<?> uploadCoverPhoto(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageUploadService.uploadImage(file, "cover-photos");
            User user = userService.getUserProfile(userId);
            
            // Delete old cover photo if exists
            if (user.getCoverPhoto() != null) {
                imageUploadService.deleteImage(user.getCoverPhoto());
            }
            
            user.setCoverPhoto(imageUrl);
            User updatedUser = userService.updateProfile(userId, user);
            return ResponseEntity.ok(UserProfileDTO.fromUser(updatedUser, followRepository, friendshipRepository));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam String q,
            @RequestParam(required = false, defaultValue = "10") int limit) {
        List<User> users = userService.searchUsers(q, limit);
        List<UserDTO> userDTOs = users.stream()
                .map(user -> UserDTO.fromUser(user, followRepository, friendshipRepository))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @PostMapping("/complete-profile")
    public ResponseEntity<?> completeProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileCompletionDto profileData) {
        String userId = authentication.getName();
        User updatedUser = userService.completeProfile(userId, profileData);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/profile-status")
    public ResponseEntity<?> getProfileStatus(Authentication authentication) {
        String userId = authentication.getName();
        boolean isComplete = userService.isProfileComplete(userId);
        return ResponseEntity.ok(new ProfileStatusResponse(isComplete));
    }

    private record ProfileStatusResponse(boolean isComplete) {}
} 