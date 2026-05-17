package com.example.network_simulator;

import com.example.network_simulator.config.CorsProperties;
import com.example.network_simulator.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({ JwtProperties.class, CorsProperties.class })
public class NetworkSimulatorApplication {

	public static void main(String[] args) {
		SpringApplication.run(NetworkSimulatorApplication.class, args);
	}

}
