package com.example.demo.service;

import java.util.List;
import com.example.demo.model.User;
import com.example.demo.model.FriendRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.UserRegistrationDto;
import com.example.demo.dto.ProfileCompletionDto;

public interface UserService {
    User registerNewUser(UserRegistrationDto registrationDto);
    void registerUser(SignupRequest signUpRequest);
    User updateProfile(String userId, User updatedUser);
    User completeProfile(String userId, ProfileCompletionDto profileData);
    User getUserProfile(String userId);
    boolean isProfileComplete(String userId);
    void followUser(String userId, String userToFollowId);
    void unfollowUser(String userId, String userToUnfollowId);
    List<User> getFollowers(String userId);
    List<User> getFollowing(String userId);
    void sendFriendRequest(String senderId, String receiverId);
    void acceptFriendRequest(String requestId);
    void declineFriendRequest(String requestId);
    void cancelFriendRequest(String senderId, String receiverId);
    List<User> getFriends(String userId);
    List<User> getMutualFriends(String userId1, String userId2);
    List<FriendRequest> getPendingSentFriendRequests(String userId);
    List<FriendRequest> getPendingReceivedFriendRequests(String userId);
    void deleteProfile(String userId);
    List<User> searchUsers(String query, int limit);
} 