package com.taskplanner.repository;

import com.taskplanner.model.Account;
import com.taskplanner.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public class AuthRepository {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthRepository.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User u = new User();
        u.setId(rs.getString("id"));
        u.setEmail(rs.getString("email"));
        u.setName(rs.getString("name"));
        u.setPassword(rs.getString("password"));
        u.setImage(rs.getString("image"));
        u.setTheme(rs.getString("theme"));
        u.setCreatedAt(rs.getObject("createdAt", Timestamp.class) != null ? rs.getTimestamp("createdAt").toLocalDateTime() : null);
        u.setUpdatedAt(rs.getObject("updatedAt", Timestamp.class) != null ? rs.getTimestamp("updatedAt").toLocalDateTime() : null);
        return u;
    };

    public Optional<User> findUserByEmail(String email) {
        String query = "SELECT * FROM User WHERE email = ?";
        try {
            User u = jdbcTemplate.queryForObject(query, userRowMapper, email);
            return Optional.ofNullable(u);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void createUser(User user) {
        String query = "INSERT INTO User (id, email, name, password, image, theme, createdAt, updatedAt) " +
                "VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
        jdbcTemplate.update(query,
                user.getId(), user.getEmail(), user.getName(), user.getPassword(), user.getImage(), user.getTheme() != null ? user.getTheme() : "light");
        LOGGER.info("User created: {}", user.getId());
    }

    public void createAccount(Account account) {
        String query = "INSERT INTO Account (id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(query,
                account.getId(), account.getUserId(), account.getType(), account.getProvider(), account.getProviderAccountId(),
                account.getRefreshToken(), account.getAccessToken(), account.getExpiresAt(), account.getTokenType(), account.getScope(),
                account.getIdToken(), account.getSessionState());
        LOGGER.info("Account created: {} for user {}", account.getId(), account.getUserId());
    }

    public void updateAccountTokens(String userId, String refreshToken, String accessToken, Integer expiresAt, String tokenType) {
        String query = "UPDATE Account SET refresh_token = ?, access_token = ?, expires_at = ?, token_type = ? WHERE userId = ? AND provider = 'local'";
        jdbcTemplate.update(query, refreshToken, accessToken, expiresAt, tokenType, userId);
        LOGGER.info("Updated tokens for user {} (provider=local)", userId);
    }
}
