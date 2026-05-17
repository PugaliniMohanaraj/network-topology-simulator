import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as topologyApi from "../api/topologyApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { SavedTopology } from "../types/topology";

const SKILLS = [
  { label: "React", icon: "⚛", tone: "cyan" },
  { label: "TypeScript", icon: "TS", tone: "blue" },
  { label: "REST API", icon: "{ }", tone: "purple" },
  { label: "JWT Auth", icon: "🛡", tone: "purple" },
  { label: "Graph Algorithms", icon: "◎", tone: "green" },
  { label: "PostgreSQL", icon: "🐘", tone: "blue" },
  { label: "Spring Boot", icon: "🍃", tone: "green" },
  { label: "UI/UX", icon: "🎨", tone: "violet" },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [topologies, setTopologies] = useState<SavedTopology[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await topologyApi.fetchTopologies();
      setTopologies(data);
    } catch {
      showToast("Could not load projects. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await topologyApi.deleteTopology(id);
      showToast("Project deleted.", "success");
      load();
    } catch {
      showToast("Delete failed.", "error");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__glow" aria-hidden />

      <nav className="dashboard-nav">
        <Link to="/" className="dashboard-nav__brand">
          <span className="dashboard-nav__logo">⬡</span>
          NetTopo Sim
        </Link>
        <div className="dashboard-nav__right">
          <span className="dashboard-user">
            Hi, <strong>{user?.name}</strong>
          </span>
          <button type="button" className="dash-btn dash-btn--outline" onClick={() => load()}>
            <span className="dash-btn__icon" aria-hidden>
              ↻
            </span>
            Refresh
          </button>
          <Link to="/designer" className="dash-btn dash-btn--gradient">
            <span className="dash-btn__icon" aria-hidden>
              +
            </span>
            New Topology
          </Link>
          <button type="button" className="dash-btn dash-btn--outline" onClick={logout}>
            <span className="dash-btn__icon" aria-hidden>
              ⎋
            </span>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>My Projects</h1>
          <p>Your saved network topologies — open any project in the designer.</p>
        </header>

        {loading ? (
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />
            <p>Loading your projects…</p>
          </div>
        ) : topologies.length === 0 ? (
          <div className="dashboard-empty-card">
            <div className="dashboard-empty-card__pattern" aria-hidden />
            <div className="dashboard-empty-card__visual" aria-hidden>
              <div className="folder-illustration">
                <div className="folder-illustration__glow" />
                <div className="folder-illustration__folder">
                  <span className="folder-illustration__icon">⬡</span>
                </div>
                <div className="folder-illustration__platform" />
              </div>
            </div>
            <div className="dashboard-empty-card__content">
              <h2>No saved topologies yet.</h2>
              <p>Create your first topology and bring your network ideas to life.</p>
              <Link to="/designer" className="dash-btn dash-btn--create">
                <span className="dash-btn__icon" aria-hidden>
                  ✦
                </span>
                Create your first topology
              </Link>
            </div>
          </div>
        ) : (
          <div className="project-grid">
            {topologies.map((t) => {
              let deviceCount = 0;
              try {
                deviceCount = JSON.parse(t.nodesJson).length;
              } catch {
                deviceCount = 0;
              }
              return (
                <article key={t.id} className="project-card">
                  <div className="project-card__glow" aria-hidden />
                  <div className="project-card__icon">⬡</div>
                  <h3>{t.topologyName}</h3>
                  <p>{deviceCount} devices</p>
                  <div className="project-card__actions">
                    <button
                      type="button"
                      className="dash-btn dash-btn--gradient dash-btn--sm"
                      onClick={() => navigate("/designer", { state: { topologyId: t.id } })}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="dash-btn dash-btn--outline dash-btn--sm"
                      onClick={() => handleDelete(t.id, t.topologyName)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <section className="dashboard-skills">
          <div className="dashboard-skills__heading">
            <span className="dashboard-skills__dot" aria-hidden />
            <h2>Skills Demonstrated</h2>
          </div>
          <div className="skills-grid">
            {SKILLS.map((skill) => (
              <div key={skill.label} className={`skill-card skill-card--${skill.tone}`}>
                <span className="skill-card__icon">{skill.icon}</span>
                <span className="skill-card__label">{skill.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
