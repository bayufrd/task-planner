package com.taskplanner.dto;

/**
 * Create Task Request DTO
 */
public class CreateTaskRequest {
    private String title;
    private String description;
    private String deadline;
    private String priority;
    private String status;
    private Integer estimatedDuration;

    public CreateTaskRequest() {
    }

    public CreateTaskRequest(String title, String description, String deadline, String priority, String status,
                             Integer estimatedDuration) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.priority = priority;
        this.status = status;
        this.estimatedDuration = estimatedDuration;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(Integer estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }
}
