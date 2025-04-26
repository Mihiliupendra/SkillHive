package com.example.demo.repository;


import com.example.demo.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProgressRepo extends MongoRepository<Progress,String>{



}
