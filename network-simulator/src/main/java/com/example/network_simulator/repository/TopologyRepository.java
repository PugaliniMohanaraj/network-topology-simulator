package com.example.network_simulator.repository;

import com.example.network_simulator.model.Topology;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopologyRepository extends JpaRepository<Topology, Long> {
    List<Topology> findByUserIdOrderByUpdatedAtDesc(Long userId);
}