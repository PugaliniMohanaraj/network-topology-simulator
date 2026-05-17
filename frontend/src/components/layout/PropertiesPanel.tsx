import type { DeviceType, EntityStatus, TopologyEdge, TopologyNode } from "../../types/topology";
import { DEVICE_DEFAULTS } from "../../types/topology";

interface PropertiesPanelProps {
  selectedNode: TopologyNode | null;
  selectedEdge: TopologyEdge | null;
  onUpdateNode: (nodeId: string, patch: Partial<TopologyNode["data"]>) => void;
  onUpdateEdge: (edgeId: string, patch: Partial<NonNullable<TopologyEdge["data"]>>) => void;
  validationIssues: { field: string; message: string }[];
}

export default function PropertiesPanel({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  validationIssues,
}: PropertiesPanelProps) {
  return (
    <aside className="properties-panel designer-panel">
      <h2 className="panel-title">Properties</h2>

      {selectedNode ? (
        <div className="properties-form">
          <p className="properties-form__type">
            {DEVICE_DEFAULTS[selectedNode.data.deviceType].icon}{" "}
            {DEVICE_DEFAULTS[selectedNode.data.deviceType].label}
          </p>

          <label className="field-label">Device name</label>
          <input
            className="field-input"
            value={selectedNode.data.label}
            onChange={(e) =>
              onUpdateNode(selectedNode.id, { label: e.target.value })
            }
          />

          <label className="field-label">Device type</label>
          <select
            className="field-select"
            value={selectedNode.data.deviceType}
            onChange={(e) =>
              onUpdateNode(selectedNode.id, {
                deviceType: e.target.value as DeviceType,
              })
            }
          >
            {(Object.keys(DEVICE_DEFAULTS) as DeviceType[]).map((t) => (
              <option key={t} value={t}>
                {DEVICE_DEFAULTS[t].label}
              </option>
            ))}
          </select>

          <label className="field-label">IP address</label>
          <input
            className="field-input"
            value={selectedNode.data.ipAddress ?? ""}
            placeholder="192.168.1.10"
            onChange={(e) =>
              onUpdateNode(selectedNode.id, { ipAddress: e.target.value })
            }
          />

          <label className="field-label">Subnet mask</label>
          <input
            className="field-input"
            value={selectedNode.data.subnetMask ?? ""}
            placeholder="255.255.255.0"
            onChange={(e) =>
              onUpdateNode(selectedNode.id, { subnetMask: e.target.value })
            }
          />

          <label className="field-label">Default gateway</label>
          <input
            className="field-input"
            value={selectedNode.data.gateway ?? ""}
            placeholder="192.168.1.1"
            onChange={(e) =>
              onUpdateNode(selectedNode.id, { gateway: e.target.value })
            }
          />

          <label className="field-label">Status</label>
          <select
            className="field-select"
            value={selectedNode.data.status}
            onChange={(e) =>
              onUpdateNode(selectedNode.id, {
                status: e.target.value as EntityStatus,
              })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ) : selectedEdge ? (
        <div className="properties-form">
          <p className="properties-form__type">🔗 Network Link</p>
          <p className="properties-form__meta">
            {selectedEdge.source} → {selectedEdge.target}
          </p>

          <label className="field-label">Bandwidth (Mbps)</label>
          <input
            className="field-input"
            type="number"
            min={0}
            value={selectedEdge.data?.bandwidth ?? 100}
            onChange={(e) =>
              onUpdateEdge(selectedEdge.id, {
                bandwidth: Number(e.target.value),
              })
            }
          />

          <label className="field-label">Delay (ms)</label>
          <input
            className="field-input"
            type="number"
            min={0}
            value={selectedEdge.data?.delay ?? 10}
            onChange={(e) =>
              onUpdateEdge(selectedEdge.id, { delay: Number(e.target.value) })
            }
          />

          <label className="field-label">Packet loss (%)</label>
          <input
            className="field-input"
            type="number"
            min={0}
            max={100}
            value={selectedEdge.data?.packetLoss ?? 0}
            onChange={(e) =>
              onUpdateEdge(selectedEdge.id, {
                packetLoss: Number(e.target.value),
              })
            }
          />

          <label className="field-label">Status</label>
          <select
            className="field-select"
            value={selectedEdge.data?.status ?? "active"}
            onChange={(e) =>
              onUpdateEdge(selectedEdge.id, {
                status: e.target.value as EntityStatus,
              })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ) : (
        <p className="empty-state">Select a device or link on the canvas.</p>
      )}

      {validationIssues.length > 0 && (
        <div className="validation-box">
          <h3 className="validation-box__title">Validation</h3>
          <ul className="validation-box__list">
            {validationIssues.map((issue, i) => (
              <li key={`${issue.field}-${i}`}>{issue.message}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
