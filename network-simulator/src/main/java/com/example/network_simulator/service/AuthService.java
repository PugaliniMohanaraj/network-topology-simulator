package com.example.network_simulator.service;

import com.example.network_simulator.dto.AuthDtos;
import com.example.network_simulator.model.User;
import com.example.network_simulator.repository.UserRepository;
import com.example.network_simulator.security.JwtService;
import com.example.network_simulator.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (request.email() == null || request.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (request.password() == null || request.password().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }

        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(request.email().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();

        user = userRepository.save(user);
        return buildAuthResponse(user, "Registration successful");
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository
                .findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return buildAuthResponse(user, "Login successful");
    }

    public AuthDtos.UserProfile getProfile(UserPrincipal principal) {
        return new AuthDtos.UserProfile(principal.getId(), principal.getName(), principal.getEmail());
    }

    private AuthDtos.AuthResponse buildAuthResponse(User user, String message) {
        UserPrincipal principal = new UserPrincipal(
                user.getId(), user.getName(), user.getEmail(), user.getPasswordHash());
        String token = jwtService.generateToken(principal);
        return new AuthDtos.AuthResponse(token, user.getId(), user.getName(), user.getEmail(), message);
    }
}
