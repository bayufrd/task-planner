package com.taskplanner.controller;

import com.taskplanner.dto.ApiResponse;
import com.taskplanner.service.PlannerService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/planner")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PlannerController {

    @Autowired
    private PlannerService plannerService;

    @Autowired
    private com.taskplanner.service.TokenService tokenService;

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTodayPlan(
            HttpServletRequest request,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            String userId = extractUserId(request);
            int safeLimit = Math.min(Math.max(limit, 1), 10);
            List<Map<String, Object>> plan = plannerService.generateTodayPlanWithScores(userId, safeLimit);
            return ResponseEntity.ok(new ApiResponse<>(true, "Today plan generated successfully", plan));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to generate today plan", null));
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
