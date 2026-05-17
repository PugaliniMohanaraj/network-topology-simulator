export type Protocol = "ICMP" | "TCP" | "UDP";
export type PacketStatus = "created" | "moving" | "delivered" | "dropped";

export interface Packet {
  id: string;
  sourceId: string;
  destinationId: string;
  protocol: Protocol;
  size: number;
  ttl: number;
  status: PacketStatus;
  path: string[];
}

export interface PathResult {
  path: string[];
  totalCost: number;
  success: boolean;
  message: string;
}

export interface SimulationLogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
}

export interface SimulationReport {
  topologyName: string;
  source: string;
  destination: string;
  protocol: Protocol;
  path: string[];
  hopCount: number;
  totalDelay: number;
  result: "success" | "failure";
  timestamp: string;
  message: string;
}

export interface AnalyticsSnapshot {
  totalDevices: number;
  totalLinks: number;
  activeDevices: number;
  inactiveDevices: number;
  activeLinks: number;
  inactiveLinks: number;
  lastSimulationStatus: string;
  shortestPathCost: number | null;
  hopCount: number;
  estimatedDelay: number | null;
}
