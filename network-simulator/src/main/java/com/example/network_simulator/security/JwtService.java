package com.example.network_simulator.security;

import com.example.network_simulator.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(JwtProperties jwtProperties) {
        this.key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
        this.expirationMs = jwtProperties.getExpirationMs();
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
