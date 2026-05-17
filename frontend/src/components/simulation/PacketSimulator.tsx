import type { Protocol } from "../../types/simulation";
import type { TopologyNode } from "../../types/topology";

interface PacketSimulatorProps {
  nodes: TopologyNode[];
  sourceId: string;
  destinationId: string;
  protocol: Protocol;
  packetSize: number;
  onSourceChange: (id: string) => void;
  onDestinationChange: (id: string) => void;
  onProtocolChange: (p: Protocol) => void;
  onPacketSizeChange: (size: number) => void;
  onSimulate: () => void;
  onFindPath: () => void;
  isSimulating: boolean;
  lastResult: string;
}

export default function PacketSimulator({
  nodes,
  sourceId,
  destinationId,
  protocol,
  packetSize,
  onSourceChange,
  onDestinationChange,
  onProtocolChange,
  onPacketSizeChange,
  onSimulate,
  onFindPath,
  isSimulating,
  lastResult,
}: PacketSimulatorProps) {
  const activeNodes = nodes.filter((n) => n.data.status === "active");

  return (
    <section
      className={`packet-simulator designer-panel${isSimulating ? " packet-simulator--running" : ""}`}
    >
      <h2 className="panel-title">Packet Simulation</h2>

      <label className="field-label">Source</label>
      <select
        className="field-select"
        value={sourceId}
        onChange={(e) => onSourceChange(e.target.value)}
      >
        <option value="">Select source…</option>
        {activeNodes.map((n) => (
          <option key={n.id} value={n.id}>
            {n.data.label}
          </option>
        ))}
      </select>

      <label className="field-label">Destination</label>
      <select
        className="field-select"
        value={destinationId}
        onChange={(e) => onDestinationChange(e.target.value)}
      >
        <option value="">Select destination…</option>
        {activeNodes.map((n) => (
          <option key={n.id} value={n.id}>
            {n.data.label}
          </option>
        ))}
      </select>

      <label className="field-label">Protocol</label>
      <select
        className="field-select"
        value={protocol}
        onChange={(e) => onProtocolChange(e.target.value as Protocol)}
      >
        <option value="ICMP">ICMP</option>
        <option value="TCP">TCP</option>
        <option value="UDP">UDP</option>
      </select>

      <label className="field-label">Packet size (bytes)</label>
      <input
        className="field-input"
        type="number"
        min={64}
        max={9000}
        value={packetSize}
        onChange={(e) => onPacketSizeChange(Number(e.target.value))}
      />

      <div className="sim-actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onFindPath}
          disabled={isSimulating}
        >
          Find Path
        </button>
        <button
          type="button"
          className="btn btn--accent"
          onClick={onSimulate}
          disabled={isSimulating}
        >
          <span aria-hidden>▶</span>
          {isSimulating ? "Simulating…" : "Run Simulation"}
        </button>
      </div>

      {lastResult && <p className="sim-result">{lastResult}</p>}
    </section>
  );
}
