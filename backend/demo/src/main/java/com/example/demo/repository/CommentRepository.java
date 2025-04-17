package com.example.demo.repository;



import com.example.demo.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
    long countByPostId(String postId);
    List<Comment> findByParentCommentId(String parentCommentId);
}

