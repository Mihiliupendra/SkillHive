package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "progress")
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Progress {

    @Id
    private String id;

    private String topic;
    private String description;
    private String resourceLink;

    private String status;
    private LocalDateTime timestamp;

    private String nextSteps;
    private String reflection;

    private String template;

    // Template-specific fields
    private String projectName;         // For "Completed Project/Task"
    private String projectLink;         // For "Completed Project/Task"

    private String certificationName;   // For "Certification/Qualification"
    private String provider;            // For "Certification/Qualification" and "Workshops/Bootcamps"
    private String dateObtained;        // For "Certification/Qualification"

    private String challengeName;       // For "Challenges/Competitions"
    private String result;              // For "Challenges/Competitions"

    private String workshopName;        // For "Workshops/Bootcamps"
    private String duration;            // For "Workshops/Bootcamps"

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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
}
