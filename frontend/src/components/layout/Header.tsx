import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  topologyName: string;
  onTopologyNameChange: (name: string) => void;
  onSave: () => void;
  onRefresh: () => void;
  onValidate: () => void;
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
  onHelp: () => void;
  onExportReport?: () => void;
  isSaving: boolean;
  hasReport?: boolean;
}

export default function Header({
  topologyName,
  onTopologyNameChange,
  onSave,
  onRefresh,
  onValidate,
  onExport,
  onImport,
  onClear,
  onHelp,
  onExportReport,
  isSaving,
  hasReport,
}: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        <span className="app-header__logo">⬡</span>
        <div>
          <h1 className="app-header__title">NetTopo Sim</h1>
          <p className="app-header__subtitle">Network Topology Designer</p>
        </div>
      </Link>

      <input
        className="app-header__name-input"
        value={topologyName}
        onChange={(e) => onTopologyNameChange(e.target.value)}
        placeholder="Topology name"
        aria-label="Topology name"
      />

      <div className="app-header__actions">
        <button type="button" className="btn btn--primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onRefresh}>
          Refresh
        </button>
        <button type="button" className="btn btn--ghost" onClick={onValidate}>
          Validate
        </button>
        {hasReport && onExportReport && (
          <button type="button" className="btn btn--ghost" onClick={onExportReport}>
            Report
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={onExport}>
          Export
        </button>
        <button type="button" className="btn btn--ghost" onClick={onImport}>
          Import
        </button>
        <button type="button" className="btn btn--ghost" onClick={onHelp}>
          Help
        </button>
        <button type="button" className="btn btn--danger" onClick={onClear}>
          Clear
        </button>
      </div>

      <nav className="designer-top-nav">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="designer-user">
              <strong>{user?.name}</strong>
              <span className="designer-user__chevron" aria-hidden>
                ▾
              </span>
            </Link>
            <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn--primary btn--sm">
            Sign in to Save
          </Link>
        )}
      </nav>
    </header>
  );
}
