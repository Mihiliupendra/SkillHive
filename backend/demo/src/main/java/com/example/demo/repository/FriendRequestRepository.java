package com.example.demo.repository;

import com.example.demo.model.FriendRequest;
import com.example.demo.model.RequestStatus;
import com.example.demo.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {
    List<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    
    List<FriendRequest> findByReceiverAndStatus(User receiver, RequestStatus status);
    
    List<FriendRequest> findBySenderAndStatus(User sender, RequestStatus status);
    
    Optional<FriendRequest> findBySenderAndReceiverAndStatus(User sender, User receiver, RequestStatus status);
    
    List<FriendRequest> findBySender(User sender);
    List<FriendRequest> findByReceiver(User receiver);
} 