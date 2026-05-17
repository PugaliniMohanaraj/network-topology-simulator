package com.example.network_simulator.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    /**
     * Comma-separated list for Spring allowedOriginPatterns, e.g.
     * http://localhost:*,https://myapp.vercel.app
     */
    private String allowedOriginPatterns =
            "http://localhost:*,http://127.0.0.1:*";

    public String getAllowedOriginPatterns() {
        return allowedOriginPatterns;
    }

    public void setAllowedOriginPatterns(String allowedOriginPatterns) {
        this.allowedOriginPatterns = allowedOriginPatterns;
    }
}
