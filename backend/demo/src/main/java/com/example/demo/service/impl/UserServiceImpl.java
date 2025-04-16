package com.example.demo.service.impl;

import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UserAlreadyExistsException;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.UserRegistrationDto;
import com.example.demo.dto.ProfileCompletionDto;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// import java.util.ArrayList;
// import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final FollowRepository followRepository;
    private final FriendshipRepository friendshipRepository;
    private final PasswordEncoder encoder;

    @Override
    @Transactional
    public void registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());

        userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateProfile(String userId, User updatedUser) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        // Only update fields that are provided in the request
        if (updatedUser.getFirstName() != null) {
            existingUser.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            existingUser.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getBiography() != null) {
            existingUser.setBiography(updatedUser.getBiography());
        }
        if (updatedUser.getProfessionalHeader() != null) {
            existingUser.setProfessionalHeader(updatedUser.getProfessionalHeader());
        }
        if (updatedUser.getCountry() != null) {
            existingUser.setCountry(updatedUser.getCountry());
        }
        if (updatedUser.getCity() != null) {
            existingUser.setCity(updatedUser.getCity());
        }
        if (updatedUser.getSkills() != null) {
            existingUser.setSkills(updatedUser.getSkills());
        }
        if (updatedUser.getProfilePicture() != null) {
            existingUser.setProfilePicture(updatedUser.getProfilePicture());
        }
        if (updatedUser.getCoverPhoto() != null) {
            existingUser.setCoverPhoto(updatedUser.getCoverPhoto());
        }
        
        return userRepository.save(existingUser);
    }

    @Override
    public User getUserProfile(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    @Override
    @Transactional
    public void followUser(String userId, String userToFollowId) {
        if (userId.equals(userToFollowId)) {
            throw new BadRequestException("Users cannot follow themselves");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        User userToFollow = userRepository.findById(userToFollowId)
                .orElseThrow(() -> new ResourceNotFoundException("User to follow not found: " + userToFollowId));
        
        if (followRepository.existsByFollowerAndFollowing(user, userToFollow)) {
            throw new BadRequestException("You are already following this user");
        }
        
        Follow follow = new Follow();
        follow.setFollower(user);
        follow.setFollowing(userToFollow);
        follow.onCreate();
        
        followRepository.save(follow);
    }

    @Override
    @Transactional
    public void unfollowUser(String userId, String userToUnfollowId) {
        if (userId.equals(userToUnfollowId)) {
            throw new BadRequestException("Users cannot unfollow themselves");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        User userToUnfollow = userRepository.findById(userToUnfollowId)
                .orElseThrow(() -> new ResourceNotFoundException("User to unfollow not found: " + userToUnfollowId));
        
        if (!followRepository.existsByFollowerAndFollowing(user, userToUnfollow)) {
            throw new BadRequestException("You are not following this user");
        }
        
        followRepository.deleteByFollowerAndFollowing(user, userToUnfollow);
    }

    @Override
    public List<User> getFollowers(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        return followRepository.findByFollowing(user).stream()
                .map(Follow::getFollower)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> getFollowing(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        return followRepository.findByFollower(user).stream()
                .map(Follow::getFollowing)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void sendFriendRequest(String senderId, String receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found: " + senderId));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found: " + receiverId));
        
        if (friendshipRepository.existsByUsers(senderId, receiverId)) {
            throw new BadRequestException("Users are already friends");
        }
        
        if (friendRequestRepository.findBySenderAndReceiverAndStatus(sender, receiver, RequestStatus.PENDING).isPresent()) {
            throw new BadRequestException("Pending friend request already exists from sender to receiver");
        }

        if (friendRequestRepository.findBySenderAndReceiverAndStatus(receiver, sender, RequestStatus.PENDING).isPresent()) {
            throw new BadRequestException("Pending friend request already exists from receiver to sender");
        }

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(RequestStatus.PENDING);
        request.onCreate();
        
        friendRequestRepository.save(request);
    }

    @Override
    @Transactional
    public void acceptFriendRequest(String requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request not found: " + requestId));
        
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Friend request is not pending");
        }
        
        User sender = request.getSender();
        User receiver = request.getReceiver();
        
        Friendship friendship = new Friendship();
        friendship.setUser1(sender);
        friendship.setUser2(receiver);
        friendship.onCreate();
        
        request.setStatus(RequestStatus.ACCEPTED);
        request.onUpdate();
        
        friendshipRepository.save(friendship);
        friendRequestRepository.save(request);
    }

    @Override
    @Transactional
    public void declineFriendRequest(String requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend request not found: " + requestId));
        
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Friend request is not pending or already handled");
        }
        
        request.setStatus(RequestStatus.DECLINED);
        request.onUpdate();
        friendRequestRepository.save(request);
    }

    @Override
    public List<User> getFriends(String userId) {
        // First get all friendship records
        List<Friendship> friendships = friendshipRepository.findFriendshipsByUserId(userId);
        
        // Extract friend IDs
        Set<String> friendIds = friendships.stream()
                .map(friendship -> {
                    String user1Id = friendship.getUser1().getId();
                    String user2Id = friendship.getUser2().getId();
                    return userId.equals(user1Id) ? user2Id : user1Id;
                })
                .collect(Collectors.toSet());
        
        // Fetch all users in one query
        return friendIds.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id)))
                .collect(Collectors.toList());
    }

    @Override
    public List<User> getMutualFriends(String userId1, String userId2) {
        // Verify both users exist
        userRepository.findById(userId1)
                .orElseThrow(() -> new ResourceNotFoundException("First user not found: " + userId1));
        userRepository.findById(userId2)
                .orElseThrow(() -> new ResourceNotFoundException("Second user not found: " + userId2));

        Set<String> user1FriendIds = getFriends(userId1).stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        
        return getFriends(userId2).stream()
                .filter(friend -> user1FriendIds.contains(friend.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<FriendRequest> getPendingSentFriendRequests(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        return friendRequestRepository.findBySenderAndStatus(user, RequestStatus.PENDING);
    }

    @Override
    public List<FriendRequest> getPendingReceivedFriendRequests(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        return friendRequestRepository.findByReceiverAndStatus(user, RequestStatus.PENDING);
    }

    @Override
    @Transactional
    public void deleteProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // Delete all friendships
        List<Friendship> friendships = friendshipRepository.findFriendshipsByUserId(userId);
        friendshipRepository.deleteAll(friendships);

        // Delete all follows where user is follower or following
        List<Follow> follows = followRepository.findByFollowerOrFollowing(user);
        followRepository.deleteAll(follows);

        // Delete ALL friend requests (sent and received) regardless of status
        List<FriendRequest> allSentRequests = friendRequestRepository.findBySender(user);
        List<FriendRequest> allReceivedRequests = friendRequestRepository.findByReceiver(user);
        friendRequestRepository.deleteAll(allSentRequests);
        friendRequestRepository.deleteAll(allReceivedRequests);

        // Finally, delete the user
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void cancelFriendRequest(String senderId, String receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found: " + senderId));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found: " + receiverId));
        
        FriendRequest request = friendRequestRepository
                .findBySenderAndReceiverAndStatus(sender, receiver, RequestStatus.PENDING)
                .orElseThrow(() -> new BadRequestException("No pending friend request found from sender to receiver"));

        // Delete the friend request
        friendRequestRepository.delete(request);
    }

    @Override
    public List<User> searchUsers(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        String searchTerm = query.trim();
        
        // Try the Spring Data method first
        List<User> results = userRepository
            .findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrderByUsernameAsc(
                searchTerm, searchTerm, searchTerm);
        
        // If we get too many results, limit them
        if (results.size() > limit) {
            results = results.subList(0, limit);
        }
        
        return results;
    }

    @Override
    @Transactional
    public User registerNewUser(UserRegistrationDto registrationDto) {
        if (!registrationDto.getPassword().equals(registrationDto.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setPassword(encoder.encode(registrationDto.getPassword()));

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User completeProfile(String userId, ProfileCompletionDto profileData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setProfessionalHeader(profileData.getProfessionalHeader());
        user.setSkills(profileData.getSkills());
        user.setCountry(profileData.getCountry());
        user.setCity(profileData.getCity());
        user.setProfileComplete(true);

        return userRepository.save(user);
    }

    @Override
    public boolean isProfileComplete(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return user.isProfileComplete();
    }
} 