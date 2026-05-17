import { buildAdjacencyList } from "./graphBuilder";
import type { TopologyEdge, TopologyNode } from "../types/topology";
import type { PathResult } from "../types/simulation";

export function findShortestPath(
  nodes: TopologyNode[],
  edges: TopologyEdge[],
  sourceId: string,
  destinationId: string,
): PathResult {
  const source = nodes.find((n) => n.id === sourceId);
  const destination = nodes.find((n) => n.id === destinationId);

  if (!source || !destination) {
    return {
      path: [],
      totalCost: 0,
      success: false,
      message: "Source or destination device not found.",
    };
  }

  if (source.data.status === "inactive" || destination.data.status === "inactive") {
    return {
      path: [],
      totalCost: 0,
      success: false,
      message: "Source or destination device is inactive.",
    };
  }

  if (sourceId === destinationId) {
    return {
      path: [sourceId],
      totalCost: 0,
      success: true,
      message: "Source and destination are the same device.",
    };
  }

  const graph = buildAdjacencyList(nodes, edges);
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set(Object.keys(graph));

  Object.keys(graph).forEach((id) => {
    distances.set(id, id === sourceId ? 0 : Infinity);
    previous.set(id, null);
  });

  if (!graph[sourceId]) {
    return {
      path: [],
      totalCost: 0,
      success: false,
      message: "Source device has no active connections.",
    };
  }

  while (unvisited.size > 0) {
    let current: string | null = null;
    let minDist = Infinity;

    unvisited.forEach((id) => {
      const d = distances.get(id) ?? Infinity;
      if (d < minDist) {
        minDist = d;
        current = id;
      }
    });

    if (current === null || minDist === Infinity) break;

    unvisited.delete(current);

    if (current === destinationId) break;

    for (const neighbor of graph[current] ?? []) {
      if (!unvisited.has(neighbor.node)) continue;
      const alt = minDist + neighbor.weight;
      if (alt < (distances.get(neighbor.node) ?? Infinity)) {
        distances.set(neighbor.node, alt);
        previous.set(neighbor.node, current);
      }
    }
  }

  const totalCost = distances.get(destinationId) ?? Infinity;

  if (totalCost === Infinity) {
    return {
      path: [],
      totalCost: 0,
      success: false,
      message: "Destination unreachable — no active path exists.",
    };
  }

  const path: string[] = [];
  let cursor: string | null = destinationId;

  while (cursor) {
    path.unshift(cursor);
    cursor = previous.get(cursor) ?? null;
  }

  return {
    path,
    totalCost,
    success: true,
    message: `Shortest path found (${path.length - 1} hops, ${totalCost}ms delay).`,
  };
}
