package com.taskplanner.controller;

import com.taskplanner.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/reminders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReminderController {

    private final Map<String, Map<String, Object>> reminders = new ConcurrentHashMap<>();

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createReminder(@RequestBody Map<String, Object> request) {
        String id = UUID.randomUUID().toString();
        Map<String, Object> reminder = new LinkedHashMap<>();
        reminder.put("id", id);
        reminder.put("taskId", request.get("taskId"));
        reminder.put("message", request.getOrDefault("message", "Task reminder"));
        reminder.put("remindAt", request.get("remindAt"));
        reminder.put("status", request.getOrDefault("status", "PENDING"));
        reminder.put("createdAt", LocalDateTime.now().toString());
        reminders.put(id, reminder);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Reminder created successfully", reminder));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReminders() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Reminders retrieved successfully", new ArrayList<>(reminders.values())));
    }

    @GetMapping("/due")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDueReminders() {
        List<Map<String, Object>> dueReminders = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (Map<String, Object> reminder : reminders.values()) {
            Object remindAtValue = reminder.get("remindAt");
            if (remindAtValue instanceof String remindAt) {
                try {
                    if (!LocalDateTime.parse(remindAt).isAfter(now)) {
                        dueReminders.add(reminder);
                    }
                } catch (Exception ignored) {
                    dueReminders.add(reminder);
                }
            }
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Due reminders retrieved successfully", dueReminders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReminderById(@PathVariable String id) {
        Map<String, Object> reminder = reminders.get(id);
        if (reminder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Reminder not found", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Reminder retrieved successfully", reminder));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateReminder(@PathVariable String id,
                                                                            @RequestBody Map<String, Object> request) {
        Map<String, Object> reminder = reminders.get(id);
        if (reminder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Reminder not found", null));
        }
        reminder.putAll(request);
        reminder.put("updatedAt", LocalDateTime.now().toString());
        return ResponseEntity.ok(new ApiResponse<>(true, "Reminder updated successfully", reminder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(@PathVariable String id) {
        if (reminders.remove(id) == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Reminder not found", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Reminder deleted successfully", null));
    }
}
