import type { TopologyEdge, TopologyNode } from "../types/topology";

const IPV4_REGEX =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)\.(25[0-5]|2[0-4]\d|1?\d?\d)\.(25[0-5]|2[0-4]\d|1?\d?\d)\.(25[0-5]|2[0-4]\d|1?\d?\d)$/;

export function isValidIPv4(value: string): boolean {
  return IPV4_REGEX.test(value.trim());
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export function validateTopology(
  nodes: TopologyNode[],
  edges: TopologyEdge[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const usedIps = new Map<string, string>();

  nodes.forEach((node) => {
    const { label, deviceType, ipAddress, subnetMask, gateway, status } =
      node.data;

    if (!label?.trim()) {
      issues.push({
        field: node.id,
        message: "Device name cannot be empty.",
      });
    }

    if (deviceType !== "switch") {
      if (ipAddress?.trim()) {
        if (!isValidIPv4(ipAddress)) {
          issues.push({
            field: node.id,
            message: `${label}: Invalid IPv4 address.`,
          });
        } else if (usedIps.has(ipAddress)) {
          issues.push({
            field: node.id,
            message: `${label}: Duplicate IP ${ipAddress} (also on ${usedIps.get(ipAddress)}).`,
          });
        } else {
          usedIps.set(ipAddress, label);
        }
      }

      if (subnetMask?.trim() && !isValidIPv4(subnetMask)) {
        issues.push({
          field: node.id,
          message: `${label}: Invalid subnet mask.`,
        });
      }

      if (gateway?.trim() && !isValidIPv4(gateway)) {
        issues.push({
          field: node.id,
          message: `${label}: Invalid gateway.`,
        });
      }
    }

    if (status === "inactive") {
      issues.push({
        field: node.id,
        message: `${label}: Device is inactive.`,
      });
    }
  });

  edges.forEach((edge) => {
    const data = edge.data;
    if (!data) return;

    if (data.bandwidth < 0) {
      issues.push({
        field: edge.id,
        message: `Link ${edge.id}: Bandwidth cannot be negative.`,
      });
    }
    if (data.delay < 0) {
      issues.push({
        field: edge.id,
        message: `Link ${edge.id}: Delay cannot be negative.`,
      });
    }
    if (data.packetLoss < 0 || data.packetLoss > 100) {
      issues.push({
        field: edge.id,
        message: `Link ${edge.id}: Packet loss must be 0–100%.`,
      });
    }
    if (edge.source === edge.target) {
      issues.push({
        field: edge.id,
        message: `Link ${edge.id}: Source and destination cannot be the same.`,
      });
    }
  });

  return issues;
}

export function validateSimulationSelection(
  sourceId: string,
  destinationId: string,
): string | null {
  if (!sourceId || !destinationId) {
    return "Select both source and destination devices.";
  }
  if (sourceId === destinationId) {
    return "Source and destination cannot be the same device.";
  }
  return null;
}
