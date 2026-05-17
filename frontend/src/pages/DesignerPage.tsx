import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useEdgesState, useNodesState } from "@xyflow/react";

import { findShortestPath } from "../algorithms/dijkstra";
import * as topologyApi from "../api/topologyApi";
import AnalyticsPanel from "../components/layout/AnalyticsPanel";
import Header from "../components/layout/Header";
import HelpModal from "../components/layout/HelpModal";
import PropertiesPanel from "../components/layout/PropertiesPanel";
import Sidebar from "../components/layout/Sidebar";
import { SAMPLE_TOPOLOGIES } from "../data/sampleTopologies";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { downloadSimulationReport } from "../utils/exportReport";
import { getApiErrorMessage } from "../utils/apiError";
import PacketSimulator from "../components/simulation/PacketSimulator";
import SimulationLogs from "../components/simulation/SimulationLogs";
import TopologyCanvas from "../components/topology/TopologyCanvas";
import type {
  AnalyticsSnapshot,
  Protocol,
  SimulationLogEntry,
  SimulationReport,
} from "../types/simulation";
import {
  DEVICE_DEFAULTS,
  type DeviceType,
  type LinkEdgeData,
  type SavedTopology,
  type TopologyEdge,
  type TopologyNode,
} from "../types/topology";
import { generateId } from "../utils/idGenerator";
import {
  validateSimulationSelection,
  validateTopology,
} from "../utils/validation";

function formatTime(): string {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function createLog(
  message: string,
  level: SimulationLogEntry["level"] = "info",
): SimulationLogEntry {
  return {
    id: generateId("log"),
    timestamp: formatTime(),
    message,
    level,
  };
}

let deviceCounter = 0;

export default function DesignerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [helpOpen, setHelpOpen] = useState(false);
  const [loadedTopologyId, setLoadedTopologyId] = useState<number | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<TopologyNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<TopologyEdge>([]);

  const [topologyName, setTopologyName] = useState("My Network Topology");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [validationIssues, setValidationIssues] = useState<
    { field: string; message: string }[]
  >([]);

  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [protocol, setProtocol] = useState<Protocol>("ICMP");
  const [packetSize, setPacketSize] = useState(64);

  const [logs, setLogs] = useState<SimulationLogEntry[]>([]);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [activeHopIndex, setActiveHopIndex] = useState(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastResult, setLastResult] = useState("");
  const [lastReport, setLastReport] = useState<SimulationReport | null>(null);

  const [savedTopologies, setSavedTopologies] = useState<SavedTopology[]>([]);
  const [selectedTopologyId, setSelectedTopologyId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  );

  const appendLog = useCallback(
    (message: string, level: SimulationLogEntry["level"] = "info") => {
      setLogs((prev) => [...prev, createLog(message, level)]);
    },
    [],
  );

  const addDevice = useCallback(
    (type: DeviceType) => {
      deviceCounter += 1;
      const meta = DEVICE_DEFAULTS[type];
      const id = generateId(type);
      const newNode: TopologyNode = {
        id,
        type: "device",
        position: { x: 120 + deviceCounter * 40, y: 80 + deviceCounter * 35 },
        data: {
          label: `${meta.label} ${deviceCounter}`,
          deviceType: type,
          ipAddress: type !== "switch" ? `192.168.1.${deviceCounter + 10}` : undefined,
          subnetMask: type !== "switch" ? "255.255.255.0" : undefined,
          gateway: type === "pc" ? "192.168.1.1" : undefined,
          status: "active",
        },
      };
      setNodes((nds) => [...nds, newNode]);
      appendLog(`Added ${meta.label} "${newNode.data.label}".`);
    },
    [setNodes, appendLog],
  );

  const onNodeClick = useCallback((node: TopologyNode) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  const onEdgeClick = useCallback((edge: TopologyEdge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  const onUpdateNode = useCallback(
    (nodeId: string, patch: Partial<TopologyNode["data"]>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n,
        ),
      );
    },
    [setNodes],
  );

  const onUpdateEdge = useCallback(
    (edgeId: string, patch: Partial<LinkEdgeData>) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId
            ? { ...e, data: { ...(e.data ?? defaultLinkData()), ...patch } }
            : e,
        ),
      );
    },
    [setEdges],
  );

  const deleteSelected = useCallback(() => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNodeId && e.target !== selectedNodeId,
        ),
      );
      appendLog(`Removed device "${node?.data.label ?? selectedNodeId}".`, "warning");
      setSelectedNodeId(null);
      return;
    }
    if (selectedEdgeId) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
      appendLog("Removed link.", "warning");
      setSelectedEdgeId(null);
    }
  }, [selectedNodeId, selectedEdgeId, nodes, setNodes, setEdges, appendLog]);

  const runValidation = useCallback(() => {
    const issues = validateTopology(nodes, edges);
    setValidationIssues(issues);
    if (issues.length === 0) {
      appendLog("Topology validation passed.", "success");
    } else {
      appendLog(`Validation found ${issues.length} issue(s).`, "warning");
    }
  }, [nodes, edges, appendLog]);

  const getNodeLabel = useCallback(
    (id: string) => nodes.find((n) => n.id === id)?.data.label ?? id,
    [nodes],
  );

  const runFindPath = useCallback(() => {
    const selectionError = validateSimulationSelection(sourceId, destinationId);
    if (selectionError) {
      setLastResult(selectionError);
      appendLog(selectionError, "error");
      return;
    }

    const result = findShortestPath(nodes, edges, sourceId, destinationId);
    if (result.success) {
      const labels = result.path.map(getNodeLabel).join(" → ");
      setHighlightedPath(result.path);
      setActiveHopIndex(result.path.length - 1);
      setLastResult(result.message);
      appendLog(`Shortest path: ${labels}`, "success");
    } else {
      setHighlightedPath([]);
      setActiveHopIndex(-1);
      setLastResult(result.message);
      appendLog(result.message, "error");
    }

    return result;
  }, [sourceId, destinationId, nodes, edges, getNodeLabel, appendLog]);

  const animatePacket = useCallback(
    async (path: string[], totalCost: number) => {
      setIsSimulating(true);
      setHighlightedPath(path);
      setActiveHopIndex(0);

      for (let i = 0; i < path.length; i++) {
        setActiveHopIndex(i);
        const label = getNodeLabel(path[i]);
        if (i === 0) {
          appendLog(`Packet created at ${label}.`);
        } else if (i === path.length - 1) {
          appendLog(`Packet delivered to ${label}.`, "success");
        } else {
          appendLog(`Packet forwarded to ${label}.`);
        }
        await new Promise((r) => setTimeout(r, 800));
      }

      setLastResult(`Delivered in ${path.length - 1} hops, ${totalCost}ms total delay.`);
      setIsSimulating(false);
    },
    [getNodeLabel, appendLog],
  );

  const runSimulation = useCallback(async () => {
    const selectionError = validateSimulationSelection(sourceId, destinationId);
    if (selectionError) {
      setLastResult(selectionError);
      appendLog(selectionError, "error");
      return;
    }

    const issues = validateTopology(nodes, edges);
    setValidationIssues(issues);

    const srcLabel = getNodeLabel(sourceId);
    const dstLabel = getNodeLabel(destinationId);

    appendLog(
      `Packet created from ${srcLabel} to ${dstLabel} (${protocol}, ${packetSize} bytes).`,
    );

    const result = findShortestPath(nodes, edges, sourceId, destinationId);

    if (!result.success) {
      setHighlightedPath([]);
      setLastResult(result.message);
      appendLog(result.message, "error");
      setLastReport({
        topologyName,
        source: srcLabel,
        destination: dstLabel,
        protocol,
        path: [],
        hopCount: 0,
        totalDelay: 0,
        result: "failure",
        timestamp: new Date().toISOString(),
        message: result.message,
      });
      return;
    }

    const pathLabels = result.path.map(getNodeLabel).join(" → ");
    appendLog(`Shortest path found: ${pathLabels}`, "success");

    await animatePacket(result.path, result.totalCost);

    setLastReport({
      topologyName,
      source: srcLabel,
      destination: dstLabel,
      protocol,
      path: result.path.map(getNodeLabel),
      hopCount: result.path.length - 1,
      totalDelay: result.totalCost,
      result: "success",
      timestamp: new Date().toISOString(),
      message: "Packet delivered successfully.",
    });
  }, [
    sourceId,
    destinationId,
    nodes,
    edges,
    protocol,
    packetSize,
    topologyName,
    getNodeLabel,
    appendLog,
    animatePacket,
  ]);

  const storageUsedMb = useMemo(() => {
    try {
      const bytes = new Blob([JSON.stringify({ nodes, edges, topologyName })]).size;
      return bytes / (1024 * 1024);
    } catch {
      return 0;
    }
  }, [nodes, edges, topologyName]);

  const analytics: AnalyticsSnapshot = useMemo(() => {
    const activeDevices = nodes.filter((n) => n.data.status === "active").length;
    const activeLinks = edges.filter((e) => e.data?.status === "active").length;

    return {
      totalDevices: nodes.length,
      totalLinks: edges.length,
      activeDevices,
      inactiveDevices: nodes.length - activeDevices,
      activeLinks,
      inactiveLinks: edges.length - activeLinks,
      lastSimulationStatus: lastReport?.result ?? "—",
      shortestPathCost: lastReport?.totalDelay ?? null,
      hopCount: lastReport?.hopCount ?? 0,
      estimatedDelay: lastReport?.totalDelay ?? null,
    };
  }, [nodes, edges, lastReport]);

  const fetchSaved = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedTopologies([]);
      return;
    }
    try {
      const list = await topologyApi.fetchTopologies();
      setSavedTopologies(list);
      appendLog(`Loaded ${list.length} saved topology(ies).`);
    } catch {
      appendLog("Could not reach backend. Is Spring Boot running on :8080?", "warning");
    }
  }, [isAuthenticated, appendLog]);

  const saveTopology = useCallback(async () => {
    if (!isAuthenticated) {
      showToast("Sign in to save projects to the cloud.", "warning");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        topologyName,
        nodesJson: JSON.stringify(nodes),
        edgesJson: JSON.stringify(edges),
      };
      if (loadedTopologyId) {
        await topologyApi.updateTopology(loadedTopologyId, payload);
        showToast("Topology updated.", "success");
      } else {
        const saved = await topologyApi.saveTopology(payload);
        setLoadedTopologyId(saved.id);
        showToast("Topology saved.", "success");
      }
      await fetchSaved();
      appendLog(`Topology "${topologyName}" saved.`, "success");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Save failed.");
      showToast(msg, "error");
      appendLog(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }, [
    isAuthenticated,
    topologyName,
    nodes,
    edges,
    loadedTopologyId,
    fetchSaved,
    appendLog,
    showToast,
  ]);

  const loadTopology = useCallback(async () => {
    if (!isAuthenticated) {
      showToast("Sign in to load cloud projects.", "warning");
      return;
    }
    if (!selectedTopologyId) {
      appendLog("Select a topology to load.", "warning");
      return;
    }
    try {
      const data = await topologyApi.loadTopology(Number(selectedTopologyId));
      setTopologyName(data.topologyName);
      setNodes(JSON.parse(data.nodesJson) as TopologyNode[]);
      setEdges(JSON.parse(data.edgesJson) as TopologyEdge[]);
      setLoadedTopologyId(data.id);
      setHighlightedPath([]);
      setActiveHopIndex(-1);
      appendLog(`Loaded "${data.topologyName}".`, "success");
      showToast(`Loaded "${data.topologyName}"`, "success");
    } catch {
      appendLog("Load failed.", "error");
      showToast("Load failed.", "error");
    }
  }, [isAuthenticated, selectedTopologyId, setNodes, setEdges, appendLog, showToast]);

  const loadSample = useCallback(
    (sampleId: string) => {
      const sample = SAMPLE_TOPOLOGIES.find((s) => s.id === sampleId);
      if (!sample) return;
      setTopologyName(sample.name);
      setNodes(sample.nodes);
      setEdges(sample.edges);
      setLoadedTopologyId(null);
      setHighlightedPath([]);
      setActiveHopIndex(-1);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      appendLog(`Loaded demo template: ${sample.name}.`, "success");
      showToast(`Template "${sample.name}" loaded`, "success");
    },
    [setNodes, setEdges, appendLog, showToast],
  );

  useEffect(() => {
    const state = location.state as { topologyId?: number } | null;
    if (state?.topologyId && isAuthenticated) {
      setSelectedTopologyId(String(state.topologyId));
      topologyApi
        .loadTopology(state.topologyId)
        .then((data) => {
          setTopologyName(data.topologyName);
          setNodes(JSON.parse(data.nodesJson) as TopologyNode[]);
          setEdges(JSON.parse(data.edgesJson) as TopologyEdge[]);
          setLoadedTopologyId(data.id);
          showToast(`Opened "${data.topologyName}"`, "success");
        })
        .catch(() => showToast("Could not open project.", "error"));
    }
  }, [location.state, isAuthenticated, setNodes, setEdges, showToast]);

  const exportTopology = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify({ topologyName, nodes, edges }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topologyName.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    appendLog("Topology exported as JSON.");
  }, [topologyName, nodes, edges, appendLog]);

  const importTopology = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as {
            topologyName?: string;
            nodes?: TopologyNode[];
            edges?: TopologyEdge[];
          };
          if (data.topologyName) setTopologyName(data.topologyName);
          if (data.nodes) setNodes(data.nodes);
          if (data.edges) setEdges(data.edges);
          appendLog("Topology imported from file.", "success");
        } catch {
          appendLog("Invalid topology file.", "error");
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges, appendLog],
  );

  const clearCanvas = useCallback(() => {
    if (!window.confirm("Clear entire canvas?")) return;
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setHighlightedPath([]);
    setActiveHopIndex(-1);
    setLogs([]);
    setValidationIssues([]);
    setLastResult("");
    setLastReport(null);
    deviceCounter = 0;
    appendLog("Canvas cleared.");
  }, [setNodes, setEdges, appendLog]);

  return (
    <div className="designer-app">
      {!isAuthenticated && (
        <div className="auth-banner">
          Guest mode — simulations work locally.
          <Link to="/login">Sign in</Link> to save projects to PostgreSQL.
        </div>
      )}
      <Header
        topologyName={topologyName}
        onTopologyNameChange={setTopologyName}
        onSave={saveTopology}
        onRefresh={fetchSaved}
        onValidate={runValidation}
        onExport={exportTopology}
        onImport={() => fileInputRef.current?.click()}
        onClear={clearCanvas}
        onHelp={() => setHelpOpen(true)}
        onExportReport={
          lastReport ? () => downloadSimulationReport(lastReport) : undefined
        }
        hasReport={!!lastReport}
        isSaving={isSaving}
      />

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      <div className="designer-body">
        <Sidebar
          onAddDevice={addDevice}
          onDeleteSelected={deleteSelected}
          onLoadSample={loadSample}
          savedTopologies={savedTopologies}
          selectedTopologyId={selectedTopologyId}
          onSelectTopology={setSelectedTopologyId}
          onLoadTopology={loadTopology}
          deviceCount={nodes.length}
          linkCount={edges.length}
          isAuthenticated={isAuthenticated}
          storageUsedMb={storageUsedMb}
        />

        <main className="designer-main">
          <TopologyCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setEdges={setEdges}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            highlightedPath={highlightedPath}
            activeHopIndex={activeHopIndex}
            packetPosition={null}
            isSimulating={isSimulating}
          />

          <SimulationLogs logs={logs} onClear={() => setLogs([])} />
        </main>

        <aside className="designer-right">
          <PropertiesPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onUpdateNode={onUpdateNode}
            onUpdateEdge={onUpdateEdge}
            validationIssues={validationIssues}
          />
          <PacketSimulator
            nodes={nodes}
            sourceId={sourceId}
            destinationId={destinationId}
            protocol={protocol}
            packetSize={packetSize}
            onSourceChange={setSourceId}
            onDestinationChange={setDestinationId}
            onProtocolChange={setProtocol}
            onPacketSizeChange={setPacketSize}
            onSimulate={runSimulation}
            onFindPath={runFindPath}
            isSimulating={isSimulating}
            lastResult={lastResult}
          />
          <AnalyticsPanel analytics={analytics} />

          {lastReport && (
            <section className="report-panel designer-panel">
              <h2 className="panel-title">Last Report</h2>
              <dl className="report-dl">
                <dt>Result</dt>
                <dd className={lastReport.result === "success" ? "text-success" : "text-error"}>
                  {lastReport.message}
                </dd>
                <dt>Path</dt>
                <dd>{lastReport.path.join(" → ") || "—"}</dd>
                <dt>Hops</dt>
                <dd>{lastReport.hopCount}</dd>
                <dt>Delay</dt>
                <dd>{lastReport.totalDelay} ms</dd>
              </dl>
              <button
                type="button"
                className="btn btn--secondary btn--block"
                onClick={() => downloadSimulationReport(lastReport)}
              >
                Download Report JSON
              </button>
            </section>
          )}
        </aside>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) importTopology(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function defaultLinkData(): LinkEdgeData {
  return { bandwidth: 100, delay: 10, packetLoss: 0, status: "active" };
}
