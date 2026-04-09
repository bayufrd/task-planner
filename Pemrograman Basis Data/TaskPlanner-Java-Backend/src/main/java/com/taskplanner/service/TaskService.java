package com.taskplanner.service;

import com.taskplanner.dto.CreateTaskRequest;
import com.taskplanner.dto.PaginatedResponse;
import com.taskplanner.dto.UpdateTaskRequest;
import com.taskplanner.model.Task;
import com.taskplanner.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Task Service
 * Business logic for Task operations
 */
@Service
public class TaskService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Get all tasks with pagination and filters
     */
    public PaginatedResponse<Task> getTasks(String userId, int page, int limit, 
                                            String search, String status, String priority, 
                                            String sort, String order) {
        LOGGER.info("Fetching tasks for user: {} (page: {}, limit: {})", userId, page, limit);
        
        // Validate pagination params
        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 20;

        List<Task> tasks = taskRepository.findByUserId(userId, page, limit, search, status, priority, sort, order);
        int total = taskRepository.countByUserId(userId, search, status, priority);
        int totalPages = (int) Math.ceil((double) total / limit);

        PaginatedResponse.PaginationInfo pagination = new PaginatedResponse.PaginationInfo(
            page,
            limit,
            total,
            totalPages,
            page < totalPages,
            page > 1
        );

        return new PaginatedResponse<>(
            true,
            "Tasks retrieved successfully",
            tasks,
            pagination
        );
    }

    /**
     * Get single task by ID
     */
    public Task getTaskById(String id) {
        LOGGER.info("Fetching task: {}", id);
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found: " + id));
    }

    /**
     * Create new task
     */
    public Task createTask(String userId, CreateTaskRequest request) {
        LOGGER.info("Creating task for user: {}", userId);

        // Validate required fields
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Task title is required");
        }
        if (request.getDeadline() == null) {
            throw new IllegalArgumentException("Task deadline is required");
        }

        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
        task.setUserId(userId);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDeadline(request.getDeadline());
        task.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        task.setStatus(request.getStatus() != null ? request.getStatus() : "TODO");
        task.setEstimatedDuration(request.getEstimatedDuration());
        task.setReminderTime(60); // default 60 minutes before deadline
        task.setReminderSent(false);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.create(task);
    }

    /**
     * Update task
     */
    public Task updateTask(String taskId, UpdateTaskRequest request) {
        LOGGER.info("Updating task: {}", taskId);

        Task task = getTaskById(taskId);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getDeadline() != null) task.setDeadline(request.getDeadline());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getEstimatedDuration() != null) task.setEstimatedDuration(request.getEstimatedDuration());

        taskRepository.update(taskId, task);
        return task;
    }

    /**
     * Delete task
     */
    public void deleteTask(String taskId) {
        LOGGER.info("Deleting task: {}", taskId);
        getTaskById(taskId); // Verify exists
        taskRepository.delete(taskId);
    }

    /**
     * Get tasks by priority
     */
    public PaginatedResponse<Task> getTasksByPriority(String userId, String priority, int page, int limit) {
        LOGGER.info("Fetching {} priority tasks for user: {}", priority, userId);

        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 20;

        List<Task> tasks = taskRepository.findByPriority(userId, priority, page, limit);

        return new PaginatedResponse<>(
            true,
            "Priority tasks retrieved successfully",
            tasks,
            new PaginatedResponse.PaginationInfo(page, limit, tasks.size(), 1, false, page > 1)
        );
    }
}
