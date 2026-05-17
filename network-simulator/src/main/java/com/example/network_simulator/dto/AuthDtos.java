package com.example.network_simulator.dto;

public final class AuthDtos {

    private AuthDtos() {}

    public record RegisterRequest(String name, String email, String password) {}

    public record LoginRequest(String email, String password) {}

    public record AuthResponse(
            String token,
            Long userId,
            String name,
            String email,
            String message
    ) {}

    public record UserProfile(Long id, String name, String email) {}
}
