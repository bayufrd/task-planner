package com.taskplanner.service;

import com.taskplanner.dto.CreateTaskRequest;
import com.taskplanner.dto.PaginatedResponse;
import com.taskplanner.dto.UpdateTaskRequest;
import com.taskplanner.model.Task;
import com.taskplanner.repository.TaskRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Task Service
 * Business logic for Task operations
 */
@Service
public class TaskService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PlannerService plannerService;

    public PaginatedResponse<Task> getTasks(String userId, int page, int limit,
                                            String search, String status, String priority,
                                            String sort, String order) {
        LOGGER.info("Fetching tasks for user: {} (page: {}, limit: {})", userId, page, limit);

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

    public Task getTaskById(String userId, String id) {
        LOGGER.info("Fetching task: {} for user: {}", id, userId);
        return taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));
    }

    public Task createTask(String userId, CreateTaskRequest request) {
        LOGGER.info("Creating task for user: {}", userId);

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
        task.setReminderTime(60);
        task.setReminderSent(false);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.create(task);
    }

    public Task updateTask(String userId, String taskId, UpdateTaskRequest request) {
        LOGGER.info("Updating task: {} for user: {}", taskId, userId);

        Task task = getTaskById(userId, taskId);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getDeadline() != null) task.setDeadline(request.getDeadline());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getEstimatedDuration() != null) task.setEstimatedDuration(request.getEstimatedDuration());
        if ("DONE".equalsIgnoreCase(task.getStatus()) && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
        }
        if (!"DONE".equalsIgnoreCase(task.getStatus())) {
            task.setCompletedAt(null);
        }

        taskRepository.update(taskId, task);
        return getTaskById(userId, taskId);
    }

    public Task updateTaskStatus(String userId, String taskId, String status) {
        LOGGER.info("Updating task status: {} -> {} for user: {}", taskId, status, userId);

        getTaskById(userId, taskId);
        LocalDateTime completedAt = "DONE".equalsIgnoreCase(status) ? LocalDateTime.now() : null;
        taskRepository.updateStatus(taskId, status, completedAt);
        return getTaskById(userId, taskId);
    }

    public Task completeTask(String userId, String taskId) {
        return updateTaskStatus(userId, taskId, "DONE");
    }

    public Task skipTask(String userId, String taskId) {
        return updateTaskStatus(userId, taskId, "SKIPPED");
    }

    public Map<String, Integer> getTaskStats(String userId) {
        Map<String, Integer> stats = new LinkedHashMap<>();
        stats.put("pending", taskRepository.countByStatus(userId, "TODO"));
        stats.put("inProgress", taskRepository.countByStatus(userId, "IN_PROGRESS"));
        stats.put("done", taskRepository.countByStatus(userId, "DONE"));
        stats.put("skipped", taskRepository.countByStatus(userId, "SKIPPED"));
        stats.put("total", stats.get("pending") + stats.get("inProgress") + stats.get("done") + stats.get("skipped"));
        return stats;
    }

    public List<Map<String, Object>> getDailyTaskStats(String userId, int days) {
        int safeDays = Math.max(days, 1);
        LocalDate startDate = LocalDate.now().minusDays(safeDays);
        Map<LocalDate, Integer> rawStats = taskRepository.countCompletedTasksByDay(userId, startDate);
        List<Map<String, Object>> result = new java.util.ArrayList<>();

        for (int i = 0; i <= safeDays; i++) {
            LocalDate date = startDate.plusDays(i);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("date", date.toString());
            item.put("count", rawStats.getOrDefault(date, 0));
            result.add(item);
        }

        return result;
    }

    public List<Map<String, Object>> getWeeklyTaskStats(String userId, int weeks) {
        int safeWeeks = Math.max(weeks, 1);
        LocalDate startDate = LocalDate.now().minusWeeks(safeWeeks);
        Map<String, Integer> rawStats = taskRepository.countCompletedTasksByWeek(userId, startDate);
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        WeekFields weekFields = WeekFields.ISO;

        for (int i = 0; i <= safeWeeks; i++) {
            LocalDate date = startDate.plusWeeks(i);
            int week = date.get(weekFields.weekOfWeekBasedYear());
            int year = date.get(weekFields.weekBasedYear());
            String key = String.format("%d-W%02d", year, week);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("week", key);
            item.put("count", rawStats.getOrDefault(key, 0));
            result.add(item);
        }

        return result;
    }

    public Map<String, Object> calculateTaskPriority(String userId, String taskId) {
        Task task = getTaskById(userId, taskId);
        int completedCount = taskRepository.countCompletedTasks(userId);
        int score = plannerService.calculatePriority(task, completedCount);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("taskId", taskId);
        result.put("score", score);
        result.put("priority", task.getPriority());
        result.put("status", task.getStatus());
        result.put("deadline", task.getDeadline());
        return result;
    }

    public void deleteTask(String userId, String taskId) {
        LOGGER.info("Deleting task: {} for user: {}", taskId, userId);
        getTaskById(userId, taskId);
        taskRepository.delete(taskId);
    }

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
