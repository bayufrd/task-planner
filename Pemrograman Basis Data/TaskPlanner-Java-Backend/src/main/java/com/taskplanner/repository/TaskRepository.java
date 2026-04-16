package com.taskplanner.repository;

import com.taskplanner.model.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

/**
 * Task Repository
 * Manual SQL queries for Task operations
 */
@Repository
public class TaskRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskRepository.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Task> taskRowMapper = (rs, rowNum) -> {
        Task task = new Task();
        task.setId(rs.getString("id"));
        task.setUserId(rs.getString("userId"));
        task.setTitle(rs.getString("title"));
        task.setDescription(rs.getString("description"));
        task.setDeadline(rs.getString("deadline"));
        task.setPriority(rs.getString("priority"));
        task.setStatus(rs.getString("status"));
        task.setEstimatedDuration(rs.getObject("estimatedDuration") != null ? rs.getInt("estimatedDuration") : null);
        task.setReminderSent(rs.getBoolean("reminderSent"));
        task.setReminderTime(rs.getInt("reminderTime"));
        task.setGoogleCalendarEventId(rs.getString("googleCalendarEventId"));
        task.setGoogleCalendarId(rs.getString("googleCalendarId"));
        task.setCreatedAt(rs.getObject("createdAt", Timestamp.class) != null ? 
            rs.getTimestamp("createdAt").toLocalDateTime() : null);
        task.setUpdatedAt(rs.getObject("updatedAt", Timestamp.class) != null ? 
            rs.getTimestamp("updatedAt").toLocalDateTime() : null);
        task.setCompletedAt(rs.getObject("completedAt", Timestamp.class) != null ? 
            rs.getTimestamp("completedAt").toLocalDateTime() : null);
        return task;
    };

    /**
     * Get all tasks by user ID with pagination and filters
     */
    public List<Task> findByUserId(String userId, int page, int limit, String search, String status, String priority, String sort, String order) {
        StringBuilder query = new StringBuilder("SELECT * FROM Task WHERE userId = ?");
        
        if (search != null && !search.isBlank()) {
            query.append(" AND (title LIKE ? OR description LIKE ?)");
        }
        if (status != null && !status.isBlank()) {
            query.append(" AND status = ?");
        }
        if (priority != null && !priority.isBlank()) {
            query.append(" AND priority = ?");
        }
        
        query.append(" ORDER BY ").append(sort != null ? sort : "deadline")
             .append(" ").append(order != null ? order : "ASC");
        query.append(" LIMIT ? OFFSET ?");

        int offset = (page - 1) * limit;
        Object[] params = buildParams(userId, search, status, priority, limit, offset);

        LOGGER.debug("Executing query: {}", query);
        return jdbcTemplate.query(query.toString(), taskRowMapper, params);
    }

    /**
     * Count tasks with filters
     */
    public int countByUserId(String userId, String search, String status, String priority) {
        StringBuilder query = new StringBuilder("SELECT COUNT(*) FROM Task WHERE userId = ?");
        
        if (search != null && !search.isBlank()) {
            query.append(" AND (title LIKE ? OR description LIKE ?)");
        }
        if (status != null && !status.isBlank()) {
            query.append(" AND status = ?");
        }
        if (priority != null && !priority.isBlank()) {
            query.append(" AND priority = ?");
        }

        Object[] params = buildCountParams(userId, search, status, priority);
        Integer count = jdbcTemplate.queryForObject(query.toString(), Integer.class, params);
        return count != null ? count : 0;
    }

    /**
     * Get task by ID
     */
    public Optional<Task> findById(String id) {
        String query = "SELECT * FROM Task WHERE id = ?";
        try {
            Task task = jdbcTemplate.queryForObject(query, taskRowMapper, id);
            return Optional.ofNullable(task);
        } catch (Exception e) {
            LOGGER.debug("Task not found: {}", id);
            return Optional.empty();
        }
    }

    /**
     * Create new task
     */
    public Task create(Task task) {
        String query = "INSERT INTO Task (id, userId, title, description, deadline, priority, status, " +
                       "estimatedDuration, reminderTime, reminderSent, createdAt, updatedAt) " +
                       "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        try {
            jdbcTemplate.update(query,
                task.getId(),
                task.getUserId(),
                task.getTitle(),
                task.getDescription(),
                task.getDeadline(),
                task.getPriority() != null ? task.getPriority() : "MEDIUM",
                task.getStatus() != null ? task.getStatus() : "TODO",
                task.getEstimatedDuration(),
                task.getReminderTime() != null ? task.getReminderTime() : 60,
                false
            );
            LOGGER.info("Task created: {}", task.getId());
            return task;
        } catch (Exception e) {
            LOGGER.error("Error creating task", e);
            throw new RuntimeException("Failed to create task", e);
        }
    }

    /**
     * Update task
     */
    public void update(String id, Task task) {
        String query = "UPDATE Task SET title = ?, description = ?, deadline = ?, priority = ?, " +
                       "status = ?, estimatedDuration = ?, updatedAt = NOW() WHERE id = ?";
        
        try {
            int updated = jdbcTemplate.update(query,
                task.getTitle(),
                task.getDescription(),
                task.getDeadline(),
                task.getPriority(),
                task.getStatus(),
                task.getEstimatedDuration(),
                id
            );
            if (updated > 0) {
                LOGGER.info("Task updated: {}", id);
            }
        } catch (Exception e) {
            LOGGER.error("Error updating task: {}", id, e);
            throw new RuntimeException("Failed to update task", e);
        }
    }

    /**
     * Delete task
     */
    public void delete(String id) {
        String query = "DELETE FROM Task WHERE id = ?";
        try {
            int deleted = jdbcTemplate.update(query, id);
            if (deleted > 0) {
                LOGGER.info("Task deleted: {}", id);
            }
        } catch (Exception e) {
            LOGGER.error("Error deleting task: {}", id, e);
            throw new RuntimeException("Failed to delete task", e);
        }
    }

    /**
     * Get priority-sorted tasks
     */
    public List<Task> findByPriority(String userId, String priorityLevel, int page, int limit) {
        String query = "SELECT * FROM Task WHERE userId = ? AND priority = ? " +
                       "ORDER BY deadline ASC LIMIT ? OFFSET ?";
        int offset = (page - 1) * limit;
        
        return jdbcTemplate.query(query, taskRowMapper, userId, priorityLevel, limit, offset);
    }

    /**
     * Count completed (DONE) tasks for a user - used as a derived activity metric
     */
    public int countCompletedTasks(String userId) {
        String query = "SELECT COUNT(*) FROM Task WHERE userId = ? AND status = 'DONE'";
        Integer count = jdbcTemplate.queryForObject(query, Integer.class, userId);
        return count != null ? count : 0;
    }

    /**
     * Build parameters for filtered query
     */
    private Object[] buildParams(String userId, String search, String status, String priority, int limit, int offset) {
        int paramCount = 1; // userId
        if (search != null && !search.isBlank()) paramCount += 2; // 2 for LIKE queries
        if (status != null && !status.isBlank()) paramCount += 1;
        if (priority != null && !priority.isBlank()) paramCount += 1;
        paramCount += 2; // limit and offset

        Object[] params = new Object[paramCount];
        int index = 0;
        
        params[index++] = userId;
        if (search != null && !search.isBlank()) {
            String searchTerm = "%" + search + "%";
            params[index++] = searchTerm;
            params[index++] = searchTerm;
        }
        if (status != null && !status.isBlank()) {
            params[index++] = status;
        }
        if (priority != null && !priority.isBlank()) {
            params[index++] = priority;
        }
        params[index++] = limit;
        params[index++] = offset;

        return params;
    }

    /**
     * Build parameters for count query
     */
    private Object[] buildCountParams(String userId, String search, String status, String priority) {
        int paramCount = 1; // userId
        if (search != null && !search.isBlank()) paramCount += 2;
        if (status != null && !status.isBlank()) paramCount += 1;
        if (priority != null && !priority.isBlank()) paramCount += 1;

        Object[] params = new Object[paramCount];
        int index = 0;
        
        params[index++] = userId;
        if (search != null && !search.isBlank()) {
            String searchTerm = "%" + search + "%";
            params[index++] = searchTerm;
            params[index++] = searchTerm;
        }
        if (status != null && !status.isBlank()) {
            params[index++] = status;
        }
        if (priority != null && !priority.isBlank()) {
            params[index++] = priority;
        }

        return params;
    }
}
