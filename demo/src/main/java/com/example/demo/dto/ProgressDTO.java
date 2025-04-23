package com.example.demo.dto;



import com.example.demo.model.Progress;

import java.time.LocalDateTime;

public class ProgressDTO {

    private String topic;
    private String description;
    private String resourceLink;
    private String status;
    private LocalDateTime timestamp;
    private String nextSteps;
    private String reflection;
    private String template;

    // Template-specific fields
    private String projectName;
    private String projectLink;
    private String certificationName;
    private String provider;
    private String dateObtained;
    private String challengeName;
    private String result;
    private String workshopName;
    private String duration;

    // Getters and Setters
    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getResourceLink() {
        return resourceLink;
    }

    public void setResourceLink(String resourceLink) {
        this.resourceLink = resourceLink;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getNextSteps() {
        return nextSteps;
    }

    public void setNextSteps(String nextSteps) {
        this.nextSteps = nextSteps;
    }

    public String getReflection() {
        return reflection;
    }

    public void setReflection(String reflection) {
        this.reflection = reflection;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectLink() {
        return projectLink;
    }

    public void setProjectLink(String projectLink) {
        this.projectLink = projectLink;
    }

    public String getCertificationName() {
        return certificationName;
    }

    public void setCertificationName(String certificationName) {
        this.certificationName = certificationName;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getDateObtained() {
        return dateObtained;
    }

    public void setDateObtained(String dateObtained) {
        this.dateObtained = dateObtained;
    }

    public String getChallengeName() {
        return challengeName;
    }

    public void setChallengeName(String challengeName) {
        this.challengeName = challengeName;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getWorkshopName() {
        return workshopName;
    }

    public void setWorkshopName(String workshopName) {
        this.workshopName = workshopName;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    // Mapper class to convert DTO to Entity
    public static class ProgressMapper {

        public static Progress toEntity(ProgressDTO dto) {
            Progress progress = new Progress();

            progress.setTopic(dto.getTopic());
            progress.setDescription(dto.getDescription());
            progress.setResourceLink(dto.getResourceLink());
            progress.setStatus(dto.getStatus());
            progress.setTimestamp(dto.getTimestamp());
            progress.setNextSteps(dto.getNextSteps());
            progress.setReflection(dto.getReflection());
            progress.setTemplate(dto.getTemplate());

            if ("Completed Project/Task".equals(dto.getTemplate())) {
                progress.setProjectName(dto.getProjectName());
                progress.setProjectLink(dto.getProjectLink());
            } else {
                progress.setProjectName(null);
                progress.setProjectLink(null);
            }

            if ("Certification/Qualification".equals(dto.getTemplate())) {
                progress.setCertificationName(dto.getCertificationName());
                progress.setProvider(dto.getProvider());
                progress.setDateObtained(dto.getDateObtained());
            } else {
                progress.setCertificationName(null);
                progress.setProvider(null);
                progress.setDateObtained(null);
            }

            if ("Challenges/Competitions".equals(dto.getTemplate())) {
                progress.setChallengeName(dto.getChallengeName());
                progress.setResult(dto.getResult());
            } else {
                progress.setChallengeName(null);
                progress.setResult(null);
            }

            if ("Workshops/Bootcamps".equals(dto.getTemplate())) {
                progress.setWorkshopName(dto.getWorkshopName());
                progress.setDuration(dto.getDuration());
                progress.setProvider(dto.getProvider());
            } else {
                progress.setWorkshopName(null);
                progress.setDuration(null);
            }

            return progress;
        }
    }
}