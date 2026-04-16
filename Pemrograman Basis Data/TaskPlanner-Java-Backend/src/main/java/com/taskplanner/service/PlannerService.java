package com.taskplanner.service;

import com.taskplanner.model.Task;
import com.taskplanner.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * PlannerService - core decision engine helper
 * Calculates priority score dynamically (not stored in DB) and generates today's plan
 */
@Service
public class PlannerService {

    @Autowired
    private TaskRepository taskRepository;

    /**
     * Calculate priority score for a task.
     * Uses: priority (HIGH/MEDIUM/LOW), deadline urgency, and completedCount as a simple activity metric.
     * Note: completedCount is derived (e.g. number of DONE tasks for the user) and passed in by caller.
     */
    public int calculatePriority(Task task, int completedCount) {
        int score = 0;

        // base score from priority label
        String p = task.getPriority() != null ? task.getPriority().toUpperCase() : "MEDIUM";
        switch (p) {
            case "HIGH": score += 5; break;
            case "LOW": score += 1; break;
            default: score += 3; break; // MEDIUM
        }

        // urgency: closer deadline -> higher score
        try {
            if (task.getDeadline() != null) {
                LocalDateTime dl = LocalDateTime.parse(task.getDeadline());
                Duration dur = Duration.between(LocalDateTime.now(), dl);
                long hoursLeft = dur.toHours();
                if (hoursLeft <= 1) score += 5;
                else if (hoursLeft <= 24) score += 3;
                else if (hoursLeft <= 72) score += 1;
            }
        } catch (DateTimeParseException ex) {
            // ignore parse issues; leave urgency unchanged
        }

        // simple activity adjustment: if user has many completed tasks, give a small bonus
        if (completedCount > 10) score += 1;

        return score;
    }

    /**
     * Generate today's plan: fetch user's tasks, compute dynamic scores, sort and return top N
     */
    public List<Task> generateTodayPlan(String userId, int limit) {
        // fetch tasks for user (no filters) - page 1, large limit
        List<Task> tasks = taskRepository.findByUserId(userId, 1, 1000, null, null, null, "deadline", "ASC");

        int completedCount = taskRepository.countCompletedTasks(userId);

        return tasks.stream()
                .filter(t -> !"DONE".equalsIgnoreCase(t.getStatus())) // exclude done
                .map(t -> {
                    int score = calculatePriority(t, completedCount);
                    // temporarily store score in title or other field is not desired; keep pure
                    // Instead we can decorate in caller response. For sorting we keep score locally.
                    return new Object[]{t, score};
                })
                .sorted((a, b) -> Integer.compare((int) b[1], (int) a[1]))
                .limit(limit)
                .map(o -> (Task) o[0])
                .collect(Collectors.toList());
    }
}
