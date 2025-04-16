package com.example.demo.dto;

import com.example.demo.model.User;
import com.example.demo.repository.FollowRepository;
import com.example.demo.repository.FriendshipRepository;
import lombok.Data;

@Data
public class UserProfileDTO {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String biography;
    private String professionalHeader;
    private String city;
    private String country;
    private String profilePicture;
    private String coverPhoto;
    private boolean following;
    private boolean profileComplete;

    public static UserProfileDTO fromUser(User user, FollowRepository followRepository, FriendshipRepository friendshipRepository) {
        if (user == null) return null;
        
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBiography(user.getBiography());
        dto.setProfessionalHeader(user.getProfessionalHeader());
        dto.setCity(user.getCity());
        dto.setCountry(user.getCountry());
        dto.setProfilePicture(user.getProfilePicture() != null ? 
            user.getProfilePicture() : "/frontend/public/images/Default Profile Pic.png");
        dto.setCoverPhoto(user.getCoverPhoto() != null ?
            user.getCoverPhoto() : "/frontend/public/images/Default Cover.png");
        dto.setProfileComplete(user.getFirstName() != null && 
                             user.getLastName() != null && 
                             user.getBiography() != null);
        return dto;
    }

    public static UserProfileDTO fromUserWithRelation(User user, User currentUser, FollowRepository followRepository, FriendshipRepository friendshipRepository) {
        if (user == null || currentUser == null) return null;
        
        UserProfileDTO dto = fromUser(user, followRepository, friendshipRepository);
        dto.setFollowing(followRepository.existsByFollowerAndFollowing(currentUser, user));
        return dto;
    }
} 