package com.taskplanner.controller;

import com.taskplanner.dto.ApiResponse;
import com.taskplanner.service.AiService;
import com.taskplanner.service.TaskService;
import com.taskplanner.service.TokenService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/parse-task")
    public ResponseEntity<ApiResponse<Map<String, Object>>> parseTask(@RequestBody Map<String, Object> request) {
        String command = String.valueOf(request.getOrDefault("command", request.getOrDefault("text", ""))).trim();
        try {
            Map<String, Object> parsed = aiService.parseTaskCommand(command);
            return ResponseEntity.ok(new ApiResponse<>(true, "Task command parsed successfully", parsed));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/overview-analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> overviewAnalysis(
            HttpServletRequest httpRequest,
            @RequestBody(required = false) Map<String, Object> request) {
        try {
            String userId = extractUserId(httpRequest);
            Map<String, Integer> stats = taskService.getTaskStats(userId);
            List<Map<String, Object>> dailyData = taskService.getDailyTaskStats(userId, 7);
            Map<String, Object> analysis = aiService.analyzeOverview(userId, stats, dailyData);
            return ResponseEntity.ok(new ApiResponse<>(true, "Overview analysis completed", analysis));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
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
