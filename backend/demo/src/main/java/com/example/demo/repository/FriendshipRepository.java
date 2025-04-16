package com.example.demo.repository;

import com.example.demo.model.Friendship;
// import com.skillhive.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends MongoRepository<Friendship, String> {
    @Query(value = "{ $or: [ { 'user1.$ref': 'users', 'user1.$id': ObjectId(?0) }, { 'user2.$ref': 'users', 'user2.$id': ObjectId(?0) } ] }")
    List<Friendship> findByUser(String userId);

    @Query("{ $or: [ { 'user1.$ref': 'users', 'user1.$id': ObjectId(?0), 'user2.$ref': 'users', 'user2.$id': ObjectId(?1) }, " +
          "{ 'user1.$ref': 'users', 'user1.$id': ObjectId(?1), 'user2.$ref': 'users', 'user2.$id': ObjectId(?0) } ] }")
    Optional<Friendship> findByUsers(String user1Id, String user2Id);

    @Query(value = "{ $or: [ { 'user1.$ref': 'users', 'user1.$id': ObjectId(?0), 'user2.$ref': 'users', 'user2.$id': ObjectId(?1) }, " +
          "{ 'user1.$ref': 'users', 'user1.$id': ObjectId(?1), 'user2.$ref': 'users', 'user2.$id': ObjectId(?0) } ] }", exists = true)
    boolean existsByUsers(String user1Id, String user2Id);

    @Query(value = "{ $or: [ { 'user1.$ref': 'users', 'user1.$id': ObjectId(?0) }, { 'user2.$ref': 'users', 'user2.$id': ObjectId(?0) } ] }", count = true)
    long countByUser(String userId);

    @Query(value = "{ $or: [ { 'user1.$ref': 'users', 'user1.$id': ObjectId(?0) }, { 'user2.$ref': 'users', 'user2.$id': ObjectId(?0) } ] }")
    List<Friendship> findFriendshipsByUserId(String userId);
} 