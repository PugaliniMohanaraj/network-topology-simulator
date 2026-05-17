package com.example.network_simulator.controller;

import com.example.network_simulator.model.Topology;
import com.example.network_simulator.security.UserPrincipal;
import com.example.network_simulator.service.TopologyService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/topologies")
public class TopologyController {

    private final TopologyService topologyService;

    public TopologyController(TopologyService topologyService) {
        this.topologyService = topologyService;
    }

    @PostMapping
    public Topology saveTopology(
            @RequestBody Topology topology,
            @AuthenticationPrincipal UserPrincipal user) {
        return topologyService.saveTopology(topology, user);
    }

    @PutMapping("/{id}")
    public Topology updateTopology(
            @PathVariable Long id,
            @RequestBody Topology topology,
            @AuthenticationPrincipal UserPrincipal user) {
        return topologyService.updateTopology(id, topology, user);
    }

    @GetMapping
    public List<Topology> getAllTopologies(@AuthenticationPrincipal UserPrincipal user) {
        return topologyService.getAllTopologies(user);
    }

    @GetMapping("/{id}")
    public Topology getTopologyById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        return topologyService.getTopologyById(id, user);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteTopology(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        topologyService.deleteTopology(id, user);
        return Map.of("message", "Topology deleted successfully");
    }
}
