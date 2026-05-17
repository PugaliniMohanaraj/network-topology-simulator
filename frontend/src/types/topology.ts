import type { Edge, Node } from "@xyflow/react";

export type DeviceType = "pc" | "router" | "switch" | "server" | "firewall";
export type EntityStatus = "active" | "inactive";

export interface DeviceNodeData extends Record<string, unknown> {
  label: string;
  deviceType: DeviceType;
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  status: EntityStatus;
}

export interface LinkEdgeData extends Record<string, unknown> {
  bandwidth: number;
  delay: number;
  packetLoss: number;
  status: EntityStatus;
}

export type TopologyNode = Node<DeviceNodeData, "device">;
export type TopologyEdge = Edge<LinkEdgeData>;

export interface SavedTopologyPayload {
  topologyName: string;
  nodesJson: string;
  edgesJson: string;
}

export interface SavedTopology extends SavedTopologyPayload {
  id: number;
}

export const DEVICE_DEFAULTS: Record<
  DeviceType,
  { label: string; color: string; icon: string }
> = {
  pc: { label: "PC", color: "#3b82f6", icon: "💻" },
  router: { label: "Router", color: "#f59e0b", icon: "🔀" },
  switch: { label: "Switch", color: "#10b981", icon: "🔌" },
  server: { label: "Server", color: "#8b5cf6", icon: "🖥️" },
  firewall: { label: "Firewall", color: "#ef4444", icon: "🛡️" },
};
