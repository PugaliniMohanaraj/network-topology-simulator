package com.example.network_simulator.security;

import com.example.network_simulator.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Service
public class JwtService {

    private static final int MIN_HMAC_KEY_BYTES = 32;

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(JwtProperties jwtProperties) {
        String secret = jwtProperties.getSecret();
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "JWT secret is not set. Define app.jwt.secret or APP_JWT_SECRET (at least 8 characters).");
        }
        this.key = signingKey(secret);
        this.expirationMs = jwtProperties.getExpirationMs();
    }

    /**
     * HS256 requires a key of at least 256 bits. Short env values (e.g. Render generateValue)
     * are stretched via SHA-256 so deploy does not fail with WeakKeyException.
     */
    private static SecretKey signingKey(String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < MIN_HMAC_KEY_BYTES) {
            try {
                bytes = MessageDigest.getInstance("SHA-256").digest(bytes);
            } catch (NoSuchAlgorithmException e) {
                throw new IllegalStateException("SHA-256 not available", e);
            }
        }
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(String.valueOf(principal.getId()))
                .claim("email", principal.getEmail())
                .claim("name", principal.getName())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public UserPrincipal parseToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Long id = Long.parseLong(claims.getSubject());
        String email = claims.get("email", String.class);
        String name = claims.get("name", String.class);

        return new UserPrincipal(id, name, email, "");
    }
}
