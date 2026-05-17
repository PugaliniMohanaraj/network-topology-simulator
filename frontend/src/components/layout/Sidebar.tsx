import { SAMPLE_TOPOLOGIES } from "../../data/sampleTopologies";
import type { DeviceType } from "../../types/topology";
import { DEVICE_DEFAULTS } from "../../types/topology";

interface SidebarProps {
  onAddDevice: (type: DeviceType) => void;
  onDeleteSelected: () => void;
  onLoadSample: (sampleId: string) => void;
  savedTopologies: { id: number; topologyName: string }[];
  selectedTopologyId: string;
  onSelectTopology: (id: string) => void;
  onLoadTopology: () => void;
  deviceCount: number;
  linkCount: number;
  isAuthenticated: boolean;
  storageUsedMb: number;
}

const DEVICE_BUTTONS: DeviceType[] = [
  "pc",
  "router",
  "switch",
  "server",
  "firewall",
];

const SAMPLE_ICONS: Record<string, string> = {
  "campus-lan": "🏫",
  "failover-lab": "⚡",
};

export default function Sidebar({
  onAddDevice,
  onDeleteSelected,
  onLoadSample,
  savedTopologies,
  selectedTopologyId,
  onSelectTopology,
  onLoadTopology,
  deviceCount,
  linkCount,
  isAuthenticated,
  storageUsedMb,
}: SidebarProps) {
  const storagePct = Math.min(100, (storageUsedMb / 100) * 100);
  return (
    <aside className="sidebar">
      <section className="sidebar__section">
        <h2 className="sidebar__heading">Devices</h2>
        <p className="sidebar__hint">Click to add, drag to position, connect via handles.</p>
        <div className="device-buttons">
          {DEVICE_BUTTONS.map((type) => {
            const meta = DEVICE_DEFAULTS[type];
            return (
              <button
                key={type}
                type="button"
                className={`device-btn device-btn--${type}`}
                style={{ "--device-color": meta.color } as React.CSSProperties}
                onClick={() => onAddDevice(type)}
              >
                <span className="device-btn__icon">{meta.icon}</span>
                <span>Add {meta.label}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className="btn btn--danger btn--block" onClick={onDeleteSelected}>
          Delete Selected
        </button>
      </section>

      <section className="sidebar__section">
        <h2 className="sidebar__heading">Demo Templates</h2>
        <div className="sample-list">
          {SAMPLE_TOPOLOGIES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="sample-btn"
              onClick={() => onLoadSample(sample.id)}
            >
              <span className="sample-btn__icon">{SAMPLE_ICONS[sample.id] ?? "⬡"}</span>
              <span className="sample-btn__text">
                <strong>{sample.name}</strong>
                <small>{sample.description}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar__section">
        <h2 className="sidebar__heading">
          {isAuthenticated ? "Saved Projects" : "Cloud Save"}
        </h2>
        {!isAuthenticated && (
          <p className="sidebar__hint">Sign in to save projects to the database.</p>
        )}
        <select
          className="field-select"
          value={selectedTopologyId}
          onChange={(e) => onSelectTopology(e.target.value)}
        >
          <option value="">Select topology…</option>
          {savedTopologies.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.topologyName}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn--secondary btn--block" onClick={onLoadTopology}>
          Load Topology
        </button>
        {isAuthenticated && (
          <div className="sidebar__storage">
            <div className="sidebar__storage-label">
              <span>Storage</span>
              <span>
                {storageUsedMb.toFixed(1)} MB / 100 MB
              </span>
            </div>
            <div className="sidebar__storage-bar">
              <div
                className="sidebar__storage-fill"
                style={{ width: `${storagePct}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <section className="sidebar__section sidebar__stats">
        <div className="stat-card">
          <span className="stat-card__value">{deviceCount}</span>
          <span className="stat-card__label">Devices</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{linkCount}</span>
          <span className="stat-card__label">Links</span>
        </div>
      </section>
    </aside>
  );
}
