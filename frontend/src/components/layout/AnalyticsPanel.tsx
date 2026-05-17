import type { AnalyticsSnapshot } from "../../types/simulation";

interface AnalyticsPanelProps {
  analytics: AnalyticsSnapshot;
}

const METRICS: {
  key: keyof AnalyticsSnapshot | "hopCount";
  label: string;
  icon: string;
}[] = [
  { key: "totalDevices", label: "Total Devices", icon: "🖧" },
  { key: "totalLinks", label: "Total Links", icon: "🔗" },
  { key: "activeDevices", label: "Active Devices", icon: "✓" },
  { key: "inactiveDevices", label: "Inactive Devices", icon: "○" },
  { key: "activeLinks", label: "Active Links", icon: "⚡" },
  { key: "inactiveLinks", label: "Inactive Links", icon: "⊘" },
  { key: "lastSimulationStatus", label: "Last Simulation", icon: "▶" },
  { key: "shortestPathCost", label: "Path Cost (ms)", icon: "⏱" },
  { key: "hopCount", label: "Hops", icon: "↳" },
  { key: "estimatedDelay", label: "Est. Delay (ms)", icon: "📊" },
];

export default function AnalyticsPanel({ analytics }: AnalyticsPanelProps) {
  const valueFor = (key: (typeof METRICS)[number]["key"]) => {
    const v = analytics[key as keyof AnalyticsSnapshot];
    if (v === null || v === undefined) return "—";
    return String(v);
  };

  return (
    <section className="analytics-panel designer-panel">
      <div className="designer-panel__head">
        <h2 className="panel-title">Analytics</h2>
        <span className="panel-live">
          <span className="panel-live__dot" aria-hidden />
          Live
        </span>
      </div>
      <div className="analytics-grid">
        {METRICS.map((item) => (
          <div key={item.label} className="analytics-item">
            <span className="analytics-item__icon">{item.icon}</span>
            <span className="analytics-item__value">{valueFor(item.key)}</span>
            <span className="analytics-item__label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
