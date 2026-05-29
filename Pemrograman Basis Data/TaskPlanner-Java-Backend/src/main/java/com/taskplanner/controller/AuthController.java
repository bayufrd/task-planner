package com.taskplanner.controller;

import com.taskplanner.dto.RegisterRequest;
import com.taskplanner.dto.LoginRequest;
import com.taskplanner.dto.ApiResponse;
import com.taskplanner.model.Account;
import com.taskplanner.model.User;
import com.taskplanner.repository.AuthRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthRepository authRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private com.taskplanner.service.TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody RegisterRequest req) {
        try {
            Optional<User> existing = authRepository.findUserByEmail(req.getEmail());
            if (existing.isPresent()) {
                return ResponseEntity.status(409).body(new ApiResponse<>(false, "Email already registered", null));
            }

            String userId = UUID.randomUUID().toString();
            User user = new User();
            user.setId(userId);
            user.setEmail(req.getEmail());
            user.setName(req.getName());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setTheme("light");

            try {
                authRepository.createUser(user);

                Account account = new Account();
                account.setId(UUID.randomUUID().toString());
                account.setUserId(userId);
                account.setType("credentials");
                account.setProvider("local");
                account.setProviderAccountId(req.getEmail());
                authRepository.createAccount(account);
            } catch (Exception dbEx) {
                LOGGER.error("DB error creating user/account", dbEx);
                return ResponseEntity.status(500).body(new ApiResponse<>(false, "db_error: " + dbEx.getMessage(), null));
            }

            String accessToken = tokenService.createAccessToken(user);
            String refreshToken = tokenService.createRefreshToken();
            long expiresMs = tokenService.getExpirationMs();

            try {
                authRepository.updateAccountTokens(user.getId(), refreshToken, accessToken, (int) (expiresMs / 1000), "Bearer");
            } catch (Exception e) {
                LOGGER.warn("Failed to persist tokens for user {} after register: {}", user.getId(), e.getMessage());
            }

            Map<String, Object> userData = buildUserData(user);
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("user", userData);
            payload.put("token", accessToken);
            payload.put("refreshToken", refreshToken);
            payload.put("tokenType", "Bearer");
            payload.put("expiresIn", expiresMs / 1000);

            LOGGER.info("Registered new user: {}", userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Registration successful", payload));
        } catch (Exception ex) {
            LOGGER.error("Error in register endpoint", ex);
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "error: " + ex.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            var opt = authRepository.findUserByEmail(req.getEmail());
            if (opt.isEmpty()) {
                return ResponseEntity.status(401).body("invalid_credentials");
            }
            User user = opt.get();
            if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body("invalid_credentials");
            }

            String accessToken = tokenService.createAccessToken(user);
            String refreshToken = tokenService.createRefreshToken();
            long expiresMs = tokenService.getExpirationMs();

            try {
                authRepository.updateAccountTokens(user.getId(), refreshToken, accessToken, (int) (expiresMs / 1000), "Bearer");
            } catch (Exception e) {
                LOGGER.warn("Failed to persist tokens for user {}: {}", user.getId(), e.getMessage());
            }

            Map<String, Object> userData = buildUserData(user);
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("user", userData);
            payload.put("token", accessToken);
            payload.put("refreshToken", refreshToken);
            payload.put("tokenType", "Bearer");
            payload.put("expiresIn", expiresMs / 1000);

            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", payload));
        } catch (Exception ex) {
            LOGGER.error("Error in login endpoint", ex);
            return ResponseEntity.status(500).body("error: " + ex.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getMe(HttpServletRequest request) {
        try {
            String token = extractBearerToken(request);
            Claims claims = tokenService.parseAccessToken(token);
            String userId = claims.getSubject();

            Optional<User> opt = authRepository.findUserById(userId);
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "User not found", null));
            }

            Map<String, Object> userData = buildUserData(opt.get());
            return ResponseEntity.ok(new ApiResponse<>(true, null, userData));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            LOGGER.error("Error in me endpoint", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid or expired token", null));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<?>> refresh(@RequestBody Map<String, String> body) {
        try {
            String refreshToken = body.get("refreshToken");
            if (refreshToken == null || refreshToken.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Refresh token is required", null));
            }

            Optional<User> opt = authRepository.findUserByRefreshToken(refreshToken);
            if (opt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Invalid refresh token", null));
            }

            User user = opt.get();
            String newAccessToken = tokenService.createAccessToken(user);
            String newRefreshToken = tokenService.createRefreshToken();
            long expiresMs = tokenService.getExpirationMs();

            authRepository.updateAccountTokens(user.getId(), newRefreshToken, newAccessToken, (int) (expiresMs / 1000), "Bearer");

            Map<String, Object> userData = buildUserData(user);
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("user", userData);
            payload.put("token", newAccessToken);
            payload.put("refreshToken", newRefreshToken);
            payload.put("tokenType", "Bearer");
            payload.put("expiresIn", expiresMs / 1000);

            return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed successfully", payload));
        } catch (Exception e) {
            LOGGER.error("Error in refresh endpoint", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid refresh token", null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request) {
        try {
            String token = extractBearerToken(request);
            Claims claims = tokenService.parseAccessToken(token);
            String userId = claims.getSubject();
            authRepository.clearAccountTokens(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Logout successful", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            LOGGER.error("Error in logout endpoint", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid or expired token", null));
        }
    }

    private String extractBearerToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("No token provided");
        }
        return authHeader.substring(7);
    }

    private Map<String, Object> buildUserData(User user) {
        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("theme", user.getTheme());
        userData.put("image", user.getImage());
        userData.put("createdAt", user.getCreatedAt());
        return userData;
    }

}
        
