package com.taskplanner.controller;

import com.taskplanner.dto.RegisterRequest;
import com.taskplanner.model.Account;
import com.taskplanner.model.User;
import com.taskplanner.repository.AuthRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthRepository authRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegisterRequest req) {
        // check existing user by email
        Optional<User> existing = authRepository.findUserByEmail(req.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(409).body("Email already registered");
        }

        // create user
        String userId = UUID.randomUUID().toString();
        User user = new User();
        user.setId(userId);
        user.setEmail(req.getEmail());
        user.setName(req.getName());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setTheme("light");
        authRepository.createUser(user);

        // create account entry linking to provider 'local'
        Account account = new Account();
        account.setId(UUID.randomUUID().toString());
        account.setUserId(userId);
        account.setType("credentials");
        account.setProvider("local");
        account.setProviderAccountId(req.getEmail());
        authRepository.createAccount(account);

        LOGGER.info("Registered new user: {}", userId);
        return ResponseEntity.ok().body("registered");
    }
}
