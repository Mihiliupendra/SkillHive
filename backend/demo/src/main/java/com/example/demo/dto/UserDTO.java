package com.example.demo.dto;

import com.example.demo.model.User;
import com.example.demo.repository.FollowRepository;
import com.example.demo.repository.FriendshipRepository;
import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String username;
    private String profilePicture;
    private String coverPhoto;
    private boolean following;
    private boolean profileComplete;

    public static UserDTO fromUser(User user, FollowRepository followRepository, FriendshipRepository friendshipRepository) {
        if (user == null) return null;
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setProfilePicture(user.getProfilePicture() != null ? 
            user.getProfilePicture() : "/images/default-avatar.png");
        dto.setCoverPhoto(user.getCoverPhoto() != null ?
            user.getCoverPhoto() : "/images/default-cover.png");
        dto.setProfileComplete(user.getFirstName() != null && 
                             user.getLastName() != null && 
                             user.getBiography() != null);
        return dto;
    }

    public static UserDTO fromUserWithRelation(User user, User currentUser, FollowRepository followRepository, FriendshipRepository friendshipRepository) {
        if (user == null || currentUser == null) return null;
        
        UserDTO dto = fromUser(user, followRepository, friendshipRepository);
        dto.setFollowing(followRepository.existsByFollowerAndFollowing(currentUser, user));
        return dto;
    }
} 