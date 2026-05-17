import type { TopologyEdge, TopologyNode } from "../types/topology";

export interface SampleTopology {
  id: string;
  name: string;
  description: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export const SAMPLE_TOPOLOGIES: SampleTopology[] = [
  {
    id: "campus-lan",
    name: "Campus LAN",
    description: "PCs, switch, router, and server — ideal for path simulation demos.",
    nodes: [
      {
        id: "pc-1",
        type: "device",
        position: { x: 80, y: 120 },
        data: {
          label: "PC Alpha",
          deviceType: "pc",
          ipAddress: "192.168.1.10",
          subnetMask: "255.255.255.0",
          gateway: "192.168.1.1",
          status: "active",
        },
      },
      {
        id: "sw-1",
        type: "device",
        position: { x: 280, y: 120 },
        data: { label: "Core Switch", deviceType: "switch", status: "active" },
      },
      {
        id: "rt-1",
        type: "device",
        position: { x: 480, y: 120 },
        data: {
          label: "Edge Router",
          deviceType: "router",
          ipAddress: "192.168.1.1",
          subnetMask: "255.255.255.0",
          status: "active",
        },
      },
      {
        id: "srv-1",
        type: "device",
        position: { x: 680, y: 120 },
        data: {
          label: "App Server",
          deviceType: "server",
          ipAddress: "10.0.0.50",
          subnetMask: "255.255.255.0",
          gateway: "10.0.0.1",
          status: "active",
        },
      },
      {
        id: "pc-2",
        type: "device",
        position: { x: 280, y: 280 },
        data: {
          label: "PC Beta",
          deviceType: "pc",
          ipAddress: "192.168.1.20",
          subnetMask: "255.255.255.0",
          gateway: "192.168.1.1",
          status: "active",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "pc-1",
        target: "sw-1",
        data: { bandwidth: 1000, delay: 2, packetLoss: 0, status: "active" },
      },
      {
        id: "e2",
        source: "pc-2",
        target: "sw-1",
        data: { bandwidth: 1000, delay: 2, packetLoss: 0, status: "active" },
      },
      {
        id: "e3",
        source: "sw-1",
        target: "rt-1",
        data: { bandwidth: 10000, delay: 5, packetLoss: 0, status: "active" },
      },
      {
        id: "e4",
        source: "rt-1",
        target: "srv-1",
        data: { bandwidth: 1000, delay: 15, packetLoss: 0.1, status: "active" },
      },
    ],
  },
  {
    id: "failover-lab",
    name: "Failover Lab",
    description: "Dual paths — disable a link to test Dijkstra rerouting.",
    nodes: [
      {
        id: "pc-a",
        type: "device",
        position: { x: 60, y: 160 },
        data: {
          label: "Host A",
          deviceType: "pc",
          ipAddress: "10.1.1.10",
          subnetMask: "255.255.255.0",
          status: "active",
        },
      },
      {
        id: "r1",
        type: "device",
        position: { x: 260, y: 80 },
        data: {
          label: "Router 1",
          deviceType: "router",
          ipAddress: "10.1.1.1",
          subnetMask: "255.255.255.0",
          status: "active",
        },
      },
      {
        id: "r2",
        type: "device",
        position: { x: 260, y: 240 },
        data: {
          label: "Router 2",
          deviceType: "router",
          ipAddress: "10.1.2.1",
          subnetMask: "255.255.255.0",
          status: "active",
        },
      },
      {
        id: "fw-1",
        type: "device",
        position: { x: 460, y: 160 },
        data: {
          label: "Firewall",
          deviceType: "firewall",
          ipAddress: "10.2.0.1",
          subnetMask: "255.255.255.0",
          status: "active",
        },
      },
      {
        id: "pc-b",
        type: "device",
        position: { x: 660, y: 160 },
        data: {
          label: "Host B",
          deviceType: "pc",
          ipAddress: "10.2.0.10",
          subnetMask: "255.255.255.0",
          status: "active",
        },
      },
    ],
    edges: [
      {
        id: "fa1",
        source: "pc-a",
        target: "r1",
        data: { bandwidth: 100, delay: 5, packetLoss: 0, status: "active" },
      },
      {
        id: "fa2",
        source: "pc-a",
        target: "r2",
        data: { bandwidth: 100, delay: 8, packetLoss: 0, status: "active" },
      },
      {
        id: "fa3",
        source: "r1",
        target: "fw-1",
        data: { bandwidth: 500, delay: 12, packetLoss: 0, status: "active" },
      },
      {
        id: "fa4",
        source: "r2",
        target: "fw-1",
        data: { bandwidth: 500, delay: 20, packetLoss: 0, status: "active" },
      },
      {
        id: "fa5",
        source: "fw-1",
        target: "pc-b",
        data: { bandwidth: 100, delay: 5, packetLoss: 0, status: "active" },
      },
    ],
  },
];
