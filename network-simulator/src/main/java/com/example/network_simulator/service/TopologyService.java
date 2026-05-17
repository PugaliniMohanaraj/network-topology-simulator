package com.example.network_simulator.service;

import com.example.network_simulator.model.Topology;
import com.example.network_simulator.repository.TopologyRepository;
import com.example.network_simulator.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TopologyService {

    private final TopologyRepository topologyRepository;

    public TopologyService(TopologyRepository topologyRepository) {
        this.topologyRepository = topologyRepository;
    }

    public Topology saveTopology(Topology topology, UserPrincipal user) {
        topology.setUserId(user.getId());
        return topologyRepository.save(topology);
    }

    public Topology updateTopology(Long id, Topology payload, UserPrincipal user) {
        Topology existing = getTopologyForUser(id, user);
        existing.setTopologyName(payload.getTopologyName());
        existing.setNodesJson(payload.getNodesJson());
        existing.setEdgesJson(payload.getEdgesJson());
        return topologyRepository.save(existing);
    }

    public List<Topology> getAllTopologies(UserPrincipal user) {
        return topologyRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
    }

    public Topology getTopologyById(Long id, UserPrincipal user) {
        return getTopologyForUser(id, user);
    }

    public void deleteTopology(Long id, UserPrincipal user) {
        Topology topology = getTopologyForUser(id, user);
        topologyRepository.delete(topology);
    }

    private Topology getTopologyForUser(Long id, UserPrincipal user) {
        Topology topology = topologyRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topology not found"));

        if (!topology.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return topology;
    }
}
