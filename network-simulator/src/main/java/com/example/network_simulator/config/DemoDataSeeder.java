package com.example.network_simulator.config;

import com.example.network_simulator.model.User;
import com.example.network_simulator.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmailIgnoreCase("demo@nettopo.com")) {
            User demo = User.builder()
                    .name("Demo User")
                    .email("demo@nettopo.com")
                    .passwordHash(passwordEncoder.encode("demo123"))
                    .build();
            userRepository.save(demo);
            System.out.println("Demo account created: demo@nettopo.com / demo123");
        }
    }
}
