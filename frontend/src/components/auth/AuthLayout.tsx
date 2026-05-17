import { Link } from "react-router-dom";
import AuthBackground from "./AuthBackground";
import AuthNetworkIllustration from "./AuthNetworkIllustration";

const FEATURES = [
  {
    icon: "◎",
    tone: "blue",
    title: "Visual drag-and-drop editor",
    text: "Design networks with an intuitive interface.",
  },
  {
    icon: "🛡",
    tone: "purple",
    title: "JWT-secured cloud save",
    text: "Your projects are safe and always accessible.",
  },
  {
    icon: "⚡",
    tone: "green",
    title: "Real-time packet animation",
    text: "See packets flow across your topology.",
  },
];

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="auth-split auth-split--animated">
      <AuthBackground />
      <aside className="auth-split__panel">
        <Link to="/" className="auth-split__brand">
          <span className="auth-split__logo">⬡</span>
          NetTopo Sim
        </Link>

        <span className="auth-split__badge">
          <span className="auth-split__badge-dot" aria-hidden />
          Network Topology Designer
        </span>

        <h1 className="auth-split__headline">
          Network Topology
          <br />
          <span>Design &amp; Simulation</span>
        </h1>
        <p className="auth-split__desc">
          Build topologies, run Dijkstra routing, simulate packets, and save projects to
          PostgreSQL.
        </p>

        <ul className="auth-split__features">
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              className={`auth-feature auth-feature--${f.tone}`}
              style={{ animationDelay: `${0.15 + i * 0.12}s` }}
            >
              <span className="auth-feature__icon">{f.icon}</span>
              <span className="auth-feature__text">
                <strong>{f.title}</strong>
                <small>{f.text}</small>
              </span>
            </li>
          ))}
        </ul>

        <AuthNetworkIllustration />
      </aside>

      <main className="auth-split__form-area">
        <div className="auth-card-shell">
          <div className="auth-card auth-card--glass">
            <h2>{title}</h2>
            <p className="auth-card__sub">{subtitle}</p>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
