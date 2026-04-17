package com.taskplanner.controller;

import com.taskplanner.dto.RegisterRequest;
import com.taskplanner.dto.LoginRequest;
import com.taskplanner.dto.LoginResponse;
import com.taskplanner.dto.ApiResponse;
import com.taskplanner.model.Account;
import com.taskplanner.model.User;
import com.taskplanner.repository.AuthRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
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

            LOGGER.info("Registered new user: {}", userId);
            return ResponseEntity.ok().body(new ApiResponse<>(true, "registered", userId));
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

            LoginResponse resp = new LoginResponse(accessToken, refreshToken, expiresMs / 1000);
            return ResponseEntity.ok(resp);
        } catch (Exception ex) {
            LOGGER.error("Error in login endpoint", ex);
            return ResponseEntity.status(500).body("error: " + ex.getMessage());
        }
    }

}
        
