package com.taskplanner.service;

import com.taskplanner.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
public class TokenService {

    private final SecretKey key;
    private final long expirationMs;

    public TokenService(@Value("${SPRING_JWT_SECRET:taskplanner-secret-change-me}") String secret,
                        @Value("${SPRING_JWT_EXP_MS:3600000}") long expirationMs) {
        // Use provided secret as bytes; in production use strong random secret
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String createAccessToken(User user) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(user.getId())
                .setIssuedAt(now)
                .setExpiration(exp)
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public long getExpirationMs() { return expirationMs; }

    public String createRefreshToken() {
        return UUID.randomUUID().toString() + "." + UUID.randomUUID().toString();
    }
}
