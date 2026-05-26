package com.taskplanner.controller;

import com.taskplanner.dto.ApiResponse;
import com.taskplanner.dto.CreateTaskRequest;
import com.taskplanner.dto.PaginatedResponse;
import com.taskplanner.dto.UpdateTaskRequest;
import com.taskplanner.model.Task;
import com.taskplanner.service.TaskService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Task Controller
 * API Routes for Task Management
 *
 * Base URL: /api/tasks
 */
@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TaskController {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskService taskService;

    @Autowired
    private com.taskplanner.service.TokenService tokenService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<Task>> getTasks(
            HttpServletRequest httpRequest,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "deadline") String sort,
            @RequestParam(defaultValue = "asc") String order) {

        LOGGER.info("GET /tasks - page: {}, limit: {}, search: {}, status: {}, priority: {}",
                page, limit, search, status, priority);

        try {
            String userId = extractUserId(httpRequest);
            PaginatedResponse<Task> response = taskService.getTasks(
                    userId, page, limit, search, status, priority, sort, order);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new PaginatedResponse<>(false, e.getMessage(), null, null));
        } catch (Exception e) {
            LOGGER.error("Error fetching tasks", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaginatedResponse<>(false, "Failed to fetch tasks", null, null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Task>> createTask(HttpServletRequest httpRequest, @RequestBody CreateTaskRequest request) {
        LOGGER.info("POST /tasks - Creating task: {}", request.getTitle());

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Task title is required", null));
        }

        try {
            String userId = extractUserId(httpRequest);
            Task task = taskService.createTask(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Task created successfully", task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            LOGGER.error("Error creating task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to create task", null));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getTaskStats(HttpServletRequest httpRequest) {
        LOGGER.info("GET /tasks/stats - Fetching task stats");
        try {
            String userId = extractUserId(httpRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task stats retrieved successfully", taskService.getTaskStats(userId)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/stats/daily")
    public ResponseEntity<ApiResponse<java.util.List<Map<String, Object>>>> getDailyStats(
            HttpServletRequest httpRequest,
            @RequestParam(defaultValue = "30") int days) {
        LOGGER.info("GET /tasks/stats/daily - Fetching daily stats for {} days", days);

        try {
            String userId = extractUserId(httpRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, "Daily task stats retrieved successfully", taskService.getDailyTaskStats(userId, days)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/stats/weekly")
    public ResponseEntity<ApiResponse<java.util.List<Map<String, Object>>>> getWeeklyStats(
            HttpServletRequest httpRequest,
            @RequestParam(defaultValue = "12") int weeks) {
        LOGGER.info("GET /tasks/stats/weekly - Fetching weekly stats for {} weeks", weeks);

        try {
            String userId = extractUserId(httpRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, "Weekly task stats retrieved successfully", taskService.getWeeklyTaskStats(userId, weeks)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTaskById(HttpServletRequest httpRequest, @PathVariable String id) {
        LOGGER.info("GET /tasks/{} - Fetching task", id);

        try {
            String userId = extractUserId(httpRequest);
            Task task = taskService.getTaskById(userId, id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task retrieved successfully", task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Task not found", null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(
            HttpServletRequest httpRequest,
            @PathVariable String id,
            @RequestBody UpdateTaskRequest request) {

        LOGGER.info("PUT /tasks/{} - Updating task", id);

        try {
            String userId = extractUserId(httpRequest);
            Task task = taskService.updateTask(userId, id, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task updated successfully", task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Task not found", null));
        } catch (Exception e) {
            LOGGER.error("Error updating task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to update task", null));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> patchTask(
            HttpServletRequest httpRequest,
            @PathVariable String id,
            @RequestBody UpdateTaskRequest request) {
        LOGGER.info("PATCH /tasks/{} - Updating task", id);
        return updateTask(httpRequest, id, request);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Task>> updateTaskStatus(
            HttpServletRequest httpRequest,
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        LOGGER.info("PATCH /tasks/{}/status - Updating task status", id);

        String status = request.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Task status is required", null));
        }

        try {
            String userId = extractUserId(httpRequest);
            Task task = taskService.updateTaskStatus(userId, id, status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task status updated successfully", task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Task not found", null));
        } catch (Exception e) {
            LOGGER.error("Error updating task status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to update task status", null));
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Task>> completeTask(HttpServletRequest httpRequest, @PathVariable String id) {
        LOGGER.info("POST /tasks/{}/complete - Marking task as done", id);

        try {
            String userId = extractUserId(httpRequest);
            Task task = taskService.completeTask(userId, id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task completed successfully", task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Task not found", null));
        } catch (Exception e) {
            LOGGER.error("Error completing task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to complete task", null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(HttpServletRequest httpRequest, @PathVariable String id) {
        LOGGER.info("DELETE /tasks/{} - Deleting task", id);

        try {
            String userId = extractUserId(httpRequest);
            taskService.deleteTask(userId, id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Task not found", null));
        } catch (Exception e) {
            LOGGER.error("Error deleting task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to delete task", null));
        }
    }

    @PostMapping("/{id}/priority")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculatePriority(HttpServletRequest httpRequest, @PathVariable String id) {
        LOGGER.info("POST /tasks/{}/priority - Calculating task priority", id);

        try {
            String userId = extractUserId(httpRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task priority calculated successfully", taskService.calculateTaskPriority(userId, id)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Task not found", null));
        } catch (Exception e) {
            LOGGER.error("Error calculating task priority", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to calculate task priority", null));
        }
    }

    @PostMapping("/{id}/skip")
    public ResponseEntity<ApiResponse<Task>> skipTask(HttpServletRequest httpRequest, @PathVariable String id) {
        LOGGER.info("POST /tasks/{}/skip - Marking task as skipped", id);

        try {
            String userId = extractUserId(httpRequest);
            Task task = taskService.skipTask(userId, id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task skipped successfully", task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Task not found", null));
        } catch (Exception e) {
            LOGGER.error("Error skipping task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to skip task", null));
        }
    }

    @GetMapping("/priority/{level}")
    public ResponseEntity<PaginatedResponse<Task>> getTasksByPriority(
            HttpServletRequest httpRequest,
            @PathVariable String level,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        LOGGER.info("GET /tasks/priority/{} - Fetching {} priority tasks", level, level);

        try {
            String userId = extractUserId(httpRequest);
            PaginatedResponse<Task> response = taskService.getTasksByPriority(userId, level, page, limit);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new PaginatedResponse<>(false, e.getMessage(), null, null));
        } catch (Exception e) {
            LOGGER.error("Error fetching priority tasks", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaginatedResponse<>(false, "Failed to fetch tasks", null, null));
        }
    }

    private String extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("No token provided");
        }

        String token = authHeader.substring(7);
        Claims claims = tokenService.parseAccessToken(token);
        return claims.getSubject();
    }
}
