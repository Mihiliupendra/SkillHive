package com.example.demo.service.impl;

import com.example.demo.dto.ProgressDTO;
import com.example.demo.exception.ProgressNotFoundException;
import com.example.demo.model.Progress;
import com.example.demo.repository.ProgressRepo;
import com.example.demo.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressServiceImpl implements ProgressService {

    @Autowired
    private ProgressRepo progressRepo;

    @Override
    public List<Progress> getProgress() {
        return progressRepo.findAll();
    }

    @Override
    public Optional<Progress> getProgressById(String id) {
        return progressRepo.findById(id);
    }

    @Override
    public Progress addProgress(ProgressDTO progressDTO) {
        Progress progress = ProgressDTO.ProgressMapper.toEntity(progressDTO);

        // Set timestamp if not provided
        if (progress.getTimestamp() == null) {
            progress.setTimestamp(LocalDateTime.now());
        }

        // Validate template-specific fields
        validateTemplateFields(progress);

        return progressRepo.save(progress);
    }

    @Override
    public void deleteProgress(String id) {
        if (!progressRepo.existsById(id)) {
            throw new ProgressNotFoundException(id);
        }
        progressRepo.deleteById(id);
    }

    @Override
    public Progress updateProgress(String id, ProgressDTO progressDTO) {
        Progress existingProgress = progressRepo.findById(id)
                .orElseThrow(() -> new ProgressNotFoundException(id));

        Progress progress = ProgressDTO.ProgressMapper.toEntity(progressDTO);

        // Update general fields
        updateProgressFields(existingProgress, progress);

        // Update template-specific fields
        updateTemplateFields(existingProgress, progress);

        return progressRepo.save(existingProgress);
    }

    private void validateTemplateFields(Progress progress) {
        String template = progress.getTemplate();

        if (template == null) {
            throw new IllegalArgumentException("Template must be provided");
        }

        switch (template) {
            case "Completed Project/Task":
                if (progress.getProjectName() == null || progress.getProjectLink() == null) {
                    throw new IllegalArgumentException("Project name and link must be provided for Completed Project/Task template");
                }
                break;
            case "Certification/Qualification":
                if (progress.getCertificationName() == null || progress.getDateObtained() == null || progress.getProvider() == null) {
                    throw new IllegalArgumentException("Certification name, provider, and date obtained must be provided for Certification/Qualification template");
                }
                break;
            case "Challenges/Competitions":
                if (progress.getChallengeName() == null || progress.getResult() == null) {
                    throw new IllegalArgumentException("Challenge name and result must be provided for Challenges/Competitions template");
                }
                break;
            case "Workshops/Bootcamps":
                if (progress.getWorkshopName() == null || progress.getDuration() == null || progress.getProvider() == null) {
                    throw new IllegalArgumentException("Workshop name, duration, and provider must be provided for Workshops/Bootcamps template");
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid template type");
        }
    }

    private void updateProgressFields(Progress existingProgress, Progress progress) {
        if (progress.getTopic() != null) existingProgress.setTopic(progress.getTopic());
        if (progress.getDescription() != null) existingProgress.setDescription(progress.getDescription());
        if (progress.getResourceLink() != null) existingProgress.setResourceLink(progress.getResourceLink());
        if (progress.getStatus() != null) existingProgress.setStatus(progress.getStatus());
        if (progress.getNextSteps() != null) existingProgress.setNextSteps(progress.getNextSteps());
        if (progress.getReflection() != null) existingProgress.setReflection(progress.getReflection());
        if (progress.getTemplate() != null && !progress.getTemplate().isEmpty()) {
            existingProgress.setTemplate(progress.getTemplate());
        }
    }

    private void updateTemplateFields(Progress existingProgress, Progress progress) {
        String template = progress.getTemplate();

        switch (template) {
            case "Completed Project/Task":
                if (progress.getProjectName() != null) existingProgress.setProjectName(progress.getProjectName());
                if (progress.getProjectLink() != null) existingProgress.setProjectLink(progress.getProjectLink());
                break;
            case "Certification/Qualification":
                if (progress.getCertificationName() != null) existingProgress.setCertificationName(progress.getCertificationName());
                if (progress.getDateObtained() != null) existingProgress.setDateObtained(progress.getDateObtained());
                if (progress.getProvider() != null) existingProgress.setProvider(progress.getProvider());
                break;
            case "Challenges/Competitions":
                if (progress.getChallengeName() != null) existingProgress.setChallengeName(progress.getChallengeName());
                if (progress.getResult() != null) existingProgress.setResult(progress.getResult());
                break;
            case "Workshops/Bootcamps":
                if (progress.getWorkshopName() != null) existingProgress.setWorkshopName(progress.getWorkshopName());
                if (progress.getDuration() != null) existingProgress.setDuration(progress.getDuration());
                if (progress.getProvider() != null) existingProgress.setProvider(progress.getProvider());
                break;
            default:
                throw new IllegalArgumentException("Invalid template type");
        }
    }
}


