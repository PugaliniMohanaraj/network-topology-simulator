import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  type Connection,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CanvasEmptyState from "./CanvasEmptyState";
import CustomNode from "./CustomNode";
import type { LinkEdgeData, TopologyEdge, TopologyNode } from "../../types/topology";

const nodeTypes = { device: CustomNode };

interface TopologyCanvasProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  onNodesChange: OnNodesChange<TopologyNode>;
  onEdgesChange: OnEdgesChange<TopologyEdge>;
  setEdges: React.Dispatch<React.SetStateAction<TopologyEdge[]>>;
  onNodeClick: (node: TopologyNode) => void;
  onEdgeClick: (edge: TopologyEdge) => void;
  highlightedPath: string[];
  activeHopIndex: number;
  packetPosition: { x: number; y: number } | null;
  isSimulating?: boolean;
}

function TopologyCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setEdges,
  onNodeClick,
  onEdgeClick,
  highlightedPath,
  activeHopIndex,
  packetPosition,
  isSimulating = false,
}: TopologyCanvasProps) {
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            data: {
              bandwidth: 100,
              delay: 10,
              packetLoss: 0,
              status: "active",
            } satisfies LinkEdgeData,
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const onPath = isEdgeOnPath(edge, highlightedPath);
      const isActiveHop =
        highlightedPath.length > 1 &&
        activeHopIndex > 0 &&
        isEdgeHop(edge, highlightedPath[activeHopIndex - 1], highlightedPath[activeHopIndex]);

      const inactive = edge.data?.status === "inactive";
      const stroke = inactive ? "#64748b" : isActiveHop ? "#22d3ee" : onPath ? "#34d399" : "#475569";
      const strokeWidth = isActiveHop ? 4 : onPath ? 3 : 2;

      return {
        ...edge,
        animated: onPath || isActiveHop,
        style: { stroke, strokeWidth, strokeDasharray: inactive ? "6 4" : undefined },
        label: edge.data ? `${edge.data.delay}ms` : undefined,
        labelStyle: { fill: "#94a3b8", fontSize: 10 },
      };
    });
  }, [edges, highlightedPath, activeHopIndex]);

  const styledNodes = useMemo(() => {
    return nodes.map((node) => {
      const pathIndex = highlightedPath.indexOf(node.id);
      const visited = pathIndex >= 0 && pathIndex <= activeHopIndex;
      const current = pathIndex === activeHopIndex;

      return {
        ...node,
        className: [
          visited ? "rf-node--visited" : "",
          current ? "rf-node--current" : "",
        ]
          .filter(Boolean)
          .join(" "),
      };
    });
  }, [nodes, highlightedPath, activeHopIndex]);

  return (
    <div
      className={`topology-canvas${isSimulating ? " topology-canvas--simulating" : ""}${highlightedPath.length > 0 ? " topology-canvas--path-active" : ""}`}
    >
      <ReactFlow<TopologyNode, TopologyEdge>
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_e, node) => onNodeClick(node as TopologyNode)}
        onEdgeClick={(_e, edge) => onEdgeClick(edge as TopologyEdge)}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
        defaultEdgeOptions={{ type: "smoothstep" }}
      >
        {nodes.length === 0 && (
          <Panel position="top-center" className="canvas-empty-panel">
            <CanvasEmptyState />
          </Panel>
        )}
        <Background gap={24} color="#1a2332" />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const type = (n.data as { deviceType?: string })?.deviceType;
            const colors: Record<string, string> = {
              pc: "#3b82f6",
              router: "#f59e0b",
              switch: "#10b981",
              server: "#8b5cf6",
              firewall: "#ef4444",
            };
            return colors[type ?? "pc"] ?? "#3b82f6";
          }}
          maskColor="rgba(15, 23, 42, 0.8)"
        />
        {packetPosition && (
          <Panel position="top-left">
            <div
              className="packet-marker"
              style={{
                position: "fixed",
                left: packetPosition.x,
                top: packetPosition.y,
                pointerEvents: "none",
              }}
            />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

function isEdgeOnPath(edge: TopologyEdge, path: string[]): boolean {
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (
      (edge.source === a && edge.target === b) ||
      (edge.source === b && edge.target === a)
    ) {
      return true;
    }
  }
  return false;
}

function isEdgeHop(edge: TopologyEdge, from: string, to: string): boolean {
  return (
    (edge.source === from && edge.target === to) ||
    (edge.source === to && edge.target === from)
  );
}

export default TopologyCanvas;
