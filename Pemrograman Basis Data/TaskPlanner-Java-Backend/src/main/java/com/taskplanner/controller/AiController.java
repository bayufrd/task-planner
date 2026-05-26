package com.taskplanner.controller;

import com.taskplanner.dto.ApiResponse;
import com.taskplanner.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AiController {

    @Autowired
    private TaskRepository taskRepository;

    @PostMapping("/parse-task")
    public ResponseEntity<ApiResponse<Map<String, Object>>> parseTask(@RequestBody Map<String, Object> request) {
        String text = String.valueOf(request.getOrDefault("text", "")).trim();
        Map<String, Object> parsed = new LinkedHashMap<>();
        parsed.put("title", text.isBlank() ? "Untitled Task" : text);
        parsed.put("description", text);
        parsed.put("priority", inferPriority(text));
        parsed.put("status", "TODO");
        parsed.put("estimatedDuration", 60);
        parsed.put("deadline", LocalDateTime.now().plusDays(1).withSecond(0).withNano(0).toString());
        return ResponseEntity.ok(new ApiResponse<>(true, "Task parsed successfully", parsed));
    }

    @PostMapping("/overview-analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> overviewAnalysis(@RequestBody(required = false) Map<String, Object> request) {
        String userId = request != null && request.get("userId") != null ? String.valueOf(request.get("userId")) : "user-123";
        int totalDone = taskRepository.countCompletedTasks(userId);
        int totalTodo = taskRepository.countByStatus(userId, "TODO");
        int totalSkipped = taskRepository.countByStatus(userId, "SKIPPED");

        Map<String, Object> analysis = new LinkedHashMap<>();
        analysis.put("userId", userId);
        analysis.put("summary", String.format("User has %d active tasks, %d completed tasks, and %d skipped tasks.", totalTodo, totalDone, totalSkipped));
        analysis.put("metrics", Map.of(
                "todo", totalTodo,
                "done", totalDone,
                "skipped", totalSkipped
        ));
        analysis.put("recommendation", totalTodo > totalDone
                ? "Focus on high priority tasks and reduce overdue backlog first."
                : "Task completion trend looks healthy. Keep maintaining consistency.");
        return ResponseEntity.ok(new ApiResponse<>(true, "Overview analysis generated successfully", analysis));
    }

    private String inferPriority(String text) {
        String normalized = text.toLowerCase();
        if (normalized.contains("urgent") || normalized.contains("penting") || normalized.contains("segera")) {
            return "HIGH";
        }
        if (normalized.contains("nanti") || normalized.contains("low")) {
            return "LOW";
        }
        return "MEDIUM";
    }
}
