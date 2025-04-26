package com.example.demo.service;


import com.example.demo.dto.ProgressDTO;
import com.example.demo.model.Progress;

import java.util.List;
import java.util.Optional;

public interface ProgressService {
    List<Progress> getProgress();
    Optional<Progress> getProgressById(String id);
    Progress addProgress(ProgressDTO progressDTO); // Should accept ProgressDTO
    void deleteProgress(String id);
    Progress updateProgress(String id, ProgressDTO progressDTO); // Should accept ProgressDTO
}
