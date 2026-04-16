package com.taskplanner.controller;

import com.taskplanner.dto.ApiResponse;
import com.taskplanner.dto.CreateTaskRequest;
import com.taskplanner.dto.PaginatedResponse;
import com.taskplanner.dto.UpdateTaskRequest;
import com.taskplanner.model.Task;
import com.taskplanner.service.TaskService;
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
 * 
 * Endpoints:
 * - GET    /api/tasks                 → Get all tasks (paginated, filtered)
 * - POST   /api/tasks                 → Create new task
 * - GET    /api/tasks/:id             → Get task by ID
 * - PUT    /api/tasks/:id             → Update task
 * - DELETE /api/tasks/:id             → Delete task
 * - GET    /api/tasks/priority/:level → Get tasks by priority level
 */
@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TaskController {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskService taskService;

    // ========================================================================
    // GET /tasks
    // ========================================================================
    /**
     * Get all tasks with pagination and filters
     * 
     * Query Parameters:
     * - page (int, default: 1)
     * - limit (int, default: 20, max: 100)
     * - search (String): Search by title or description
     * - status (String): Filter by status (values: PROGRESS / DONE)
     * - priority (String): Filter by priority (HIGH, MEDIUM, LOW)
     * - sort (String): Sort field (default: deadline)
     * - order (String): Sort order (asc, desc)
     * 
     * Returns: PaginatedResponse<Task>
     */
    @GetMapping
    public ResponseEntity<PaginatedResponse<Task>> getTasks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "deadline") String sort,
            @RequestParam(defaultValue = "asc") String order) {

        LOGGER.info("GET /tasks - page: {}, limit: {}, search: {}, status: {}, priority: {}", 
                 page, limit, search, status, priority);

        // NOTE: userId hardcoded until auth/session is implemented
        String userId = "user-123";

        PaginatedResponse<Task> response = taskService.getTasks(
            userId, page, limit, search, status, priority, sort, order);

        return ResponseEntity.ok(response);
    }

    // ========================================================================
    // POST /tasks
    // ========================================================================
    /**
     * Create new task
     * 
     * Request Body:
     * {
     *   "title": "Task Title",
     *   "description": "Optional description",
     *   "deadline": "2026-04-15T10:00:00",
     *   "priority": "HIGH|MEDIUM|LOW",
     *   "status": "PROGRESS / DONE",
     *   "estimatedDuration": 120
     * }
     * 
     * Returns: ApiResponse<Task>
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Task>> createTask(@RequestBody CreateTaskRequest request) {
        LOGGER.info("POST /tasks - Creating task: {}", request.getTitle());
        
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Task title is required", null));
        }

        // NOTE: userId hardcoded until auth/session is implemented
        String userId = "user-123";

        try {
            Task task = taskService.createTask(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Task created successfully", task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            LOGGER.error("Error creating task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to create task", null));
        }
    }

    // ========================================================================
    // GET /tasks/:id
    // ========================================================================
    /**
     * Get task by ID
     * 
     * Path Parameters:
     * - id (String): Task ID
     * 
     * Returns: ApiResponse<Task>
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTaskById(@PathVariable String id) {
        LOGGER.info("GET /tasks/{} - Fetching task", id);

        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task retrieved successfully", task));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Task not found", null));
        }
    }

    // ========================================================================
    // PUT /tasks/:id
    // ========================================================================
    /**
     * Update task
     * 
     * Path Parameters:
     * - id (String): Task ID
     * 
     * Request Body: (all fields optional)
     * {
     *   "title": "Updated Title",
     *   "description": "Updated description",
     *   "deadline": "2026-04-20T10:00:00",
     *   "priority": "HIGH|MEDIUM|LOW",
     *   "status": "PROGRESS / DONE",
     *   "estimatedDuration": 150
     * }
     * 
     * Returns: ApiResponse<Task>
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(
            @PathVariable String id,
            @RequestBody UpdateTaskRequest request) {

        LOGGER.info("PUT /tasks/{} - Updating task", id);

        try {
            Task task = taskService.updateTask(id, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task updated successfully", task));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Task not found", null));
        } catch (Exception e) {
            LOGGER.error("Error updating task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to update task", null));
        }
    }

    // ========================================================================
    // DELETE /tasks/:id
    // ========================================================================
    /**
     * Delete task
     * 
     * Path Parameters:
     * - id (String): Task ID
     * 
     * Returns: ApiResponse<Void>
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable String id) {
        LOGGER.info("DELETE /tasks/{} - Deleting task", id);

        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Task not found", null));
        } catch (Exception e) {
            LOGGER.error("Error deleting task", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to delete task", null));
        }
    }

    // ========================================================================
    // GET /tasks/priority/:level
    // ========================================================================
    /**
     * Get tasks by priority level
     * 
     * Path Parameters:
     * - level (String): Priority level (HIGH, MEDIUM, LOW)
     * 
     * Query Parameters:
     * - page (int, default: 1)
     * - limit (int, default: 20)
     * 
     * Returns: PaginatedResponse<Task>
     */
    @GetMapping("/priority/{level}")
    public ResponseEntity<PaginatedResponse<Task>> getTasksByPriority(
            @PathVariable String level,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        LOGGER.info("GET /tasks/priority/{} - Fetching {} priority tasks", level, level);

        // NOTE: userId hardcoded until auth/session is implemented
        String userId = "user-123";

        try {
            PaginatedResponse<Task> response = taskService.getTasksByPriority(userId, level, page, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOGGER.error("Error fetching priority tasks", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new PaginatedResponse<>(false, "Failed to fetch tasks", null, null));
        }
    }
}
