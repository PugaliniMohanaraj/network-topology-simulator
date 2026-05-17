package com.example.network_simulator.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * HMAC secret for signing JWTs (use at least 32 characters for HS256).
     */
    private String secret = "NetTopoSimSecretKeyForJWTSigningMustBe32CharsMin!!";

    /**
     * Token validity period in milliseconds (default: 24 hours).
     */
    private long expirationMs = 86_400_000L;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }
}
