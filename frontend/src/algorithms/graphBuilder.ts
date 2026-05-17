import type { TopologyEdge, TopologyNode } from "../types/topology";

export interface GraphNeighbor {
  node: string;
  weight: number;
}

export type AdjacencyList = Record<string, GraphNeighbor[]>;

export function buildAdjacencyList(
  nodes: TopologyNode[],
  edges: TopologyEdge[],
): AdjacencyList {
  const graph: AdjacencyList = {};

  nodes
    .filter((n) => n.data.status === "active")
    .forEach((n) => {
      graph[n.id] = [];
    });

  edges
    .filter((e) => e.data?.status === "active")
    .forEach((edge) => {
      const weight = edge.data?.delay ?? 10;
      if (!graph[edge.source]) graph[edge.source] = [];
      if (!graph[edge.target]) graph[edge.target] = [];

      graph[edge.source].push({ node: edge.target, weight });
      graph[edge.target].push({ node: edge.source, weight });
    });

  return graph;
}
