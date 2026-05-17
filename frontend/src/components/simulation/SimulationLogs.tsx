import type { SimulationLogEntry } from "../../types/simulation";

interface SimulationLogsProps {
  logs: SimulationLogEntry[];
  onClear?: () => void;
}

export default function SimulationLogs({ logs, onClear }: SimulationLogsProps) {
  return (
    <section className="simulation-logs">
      <div className="simulation-logs__head">
        <h2 className="panel-title">Simulation Log</h2>
        {onClear && (
          <button type="button" className="simulation-logs__clear" onClick={onClear}>
            Clear Log
          </button>
        )}
      </div>
      <div className="simulation-logs__body">
        <div className="simulation-logs__scroll">
          {logs.length === 0 ? (
            <>
              <p className="log-status">
                <span className="log-status__dot" aria-hidden />
                System Ready
              </p>
              <p className="empty-state">No simulation activity yet.</p>
            </>
          ) : (
            <ul className="log-list">
              {logs.map((entry) => (
                <li key={entry.id} className={`log-list__item log-list__item--${entry.level}`}>
                  <span className="log-list__time">[{entry.timestamp}]</span>
                  <span className="log-list__msg">{entry.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="simulation-logs__art" aria-hidden>
          <div className="server-racks">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
