import { Link } from "react-router-dom";

const FEATURES = [
  {
    num: "01",
    icon: "⬡",
    accent: "cyan",
    title: "Visual Topology Designer",
    text: "Drag-and-drop PCs, routers, switches, servers, and firewalls on an interactive canvas.",
  },
  {
    num: "02",
    icon: "🧭",
    accent: "purple",
    title: "Dijkstra Shortest Path",
    text: "Delay-weighted routing with inactive device/link exclusion and path highlighting.",
  },
  {
    num: "03",
    icon: "📦",
    accent: "orange",
    title: "Packet Simulation",
    text: "ICMP, TCP, UDP transfers with hop-by-hop animation and live simulation logs.",
  },
  {
    num: "04",
    icon: "⚡",
    accent: "green",
    title: "Failure Simulation",
    text: "Disable links or devices and observe rerouting or destination-unreachable behavior.",
  },
  {
    num: "05",
    icon: "📊",
    accent: "blue",
    title: "Analytics & Reports",
    text: "Device/link stats, hop count, delay metrics, and exportable simulation reports.",
  },
  {
    num: "06",
    icon: "🔐",
    accent: "pink",
    title: "Secure Cloud Save",
    text: "JWT authentication with per-user topology projects stored in PostgreSQL.",
  },
];

const STEPS = [
  {
    icon: "✎",
    accent: "cyan",
    title: "Design",
    text: "Add devices and connect links with bandwidth, delay, and loss.",
  },
  {
    icon: "⚙",
    accent: "purple",
    title: "Configure",
    text: "Set IPs, masks, gateways, and active/inactive status.",
  },
  {
    icon: "▶",
    accent: "green",
    title: "Simulate",
    text: "Run Dijkstra routing and watch packets traverse the path.",
  },
];

const STACK = [
  { label: "React 19", icon: "⚛", tone: "cyan" },
  { label: "TypeScript", icon: "TS", tone: "blue" },
  { label: "Vite", icon: "⚡", tone: "purple" },
  { label: "@xyflow/react", icon: "◎", tone: "green" },
  { label: "Spring Boot", icon: "🍃", tone: "green" },
  { label: "PostgreSQL", icon: "🐘", tone: "blue" },
  { label: "JWT", icon: "🔑", tone: "orange" },
  { label: "Dijkstra", icon: "🧭", tone: "violet" },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing__grid" aria-hidden />
      <div className="landing__glow landing__glow--cyan" aria-hidden />
      <div className="landing__glow landing__glow--purple" aria-hidden />

      <nav className="landing-nav">
        <Link to="/" className="landing-nav__brand">
          <span className="landing-nav__logo">⬡</span>
          NetTopo Sim
        </Link>
        <div className="landing-nav__links">
          <Link to="/designer" className="landing-nav__link">
            Open Designer
          </Link>
          <Link to="/login" className="landing-btn landing-btn--ghost landing-btn--sm">
            Sign in
          </Link>
          <Link to="/register" className="landing-btn landing-btn--gradient landing-btn--sm">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero__content">
          <h1>
            Design, Simulate &amp; Analyze
            <br />
            <span className="landing-gradient-text">Network Topologies</span>
          </h1>
          <p className="landing-hero__lead">
            A professional web platform for visual network design, shortest-path routing,
            packet transfer simulation, and failure analysis — built for real-world learning
            and portfolio showcase.
          </p>
          <div className="landing-hero__cta">
            <Link to="/designer" className="landing-btn landing-btn--cta landing-btn--lg">
              <span className="landing-btn__icon" aria-hidden>
                🚀
              </span>
              Try Live Designer
            </Link>
            <Link to="/register" className="landing-btn landing-btn--glass landing-btn--lg">
              <span className="landing-btn__icon" aria-hidden>
                👤
              </span>
              Create Account
            </Link>
          </div>
        </div>

        <div className="landing-hero__visual">
          <div className="hero-panel">
            <div className="hero-panel__chrome">
              <span className="hero-panel__dot hero-panel__dot--red" />
              <span className="hero-panel__dot hero-panel__dot--yellow" />
              <span className="hero-panel__dot hero-panel__dot--green" />
            </div>
            <div className="hero-panel__toolbar">
              <div className="hero-chip hero-chip--pc">
                <span>💻</span> PC
              </div>
              <div className="hero-chip hero-chip--sw">
                <span>🔌</span> Switch
              </div>
              <div className="hero-chip hero-chip--rt">
                <span>🔀</span> Router
              </div>
              <div className="hero-chip hero-chip--srv">
                <span>🖥</span> Server
              </div>
            </div>
            <div className="hero-panel__canvas">
              <svg className="hero-panel__lines" viewBox="0 0 420 100" preserveAspectRatio="none" aria-hidden>
                <line
                  x1="52"
                  y1="50"
                  x2="138"
                  y2="50"
                  stroke="rgba(148,163,184,0.45)"
                  strokeWidth="2"
                  strokeDasharray="6 5"
                />
                <line
                  x1="178"
                  y1="50"
                  x2="264"
                  y2="50"
                  stroke="rgba(148,163,184,0.45)"
                  strokeWidth="2"
                  strokeDasharray="6 5"
                />
                <line
                  x1="304"
                  y1="50"
                  x2="368"
                  y2="50"
                  stroke="rgba(148,163,184,0.45)"
                  strokeWidth="2"
                  strokeDasharray="6 5"
                />
              </svg>
              <div className="hero-panel__nodes">
                <div className="hero-node hero-node--pc">
                  <span className="hero-node__icon">💻</span>
                  PC
                </div>
                <div className="hero-node hero-node--sw">
                  <span className="hero-node__icon">🔌</span>
                  Switch
                </div>
                <div className="hero-node hero-node--rt">
                  <span className="hero-node__icon">🔀</span>
                  Router
                </div>
                <div className="hero-node hero-node--srv">
                  <span className="hero-node__icon">🖥</span>
                  Server
                </div>
              </div>
            </div>
            <div className="hero-panel__glass">
              <p className="hero-panel__path">
                <span className="path-label path-label--pc">PC</span>
                <span className="path-arrow">→</span>
                <span className="path-label path-label--sw">Switch</span>
                <span className="path-arrow">→</span>
                <span className="path-label path-label--rt">Router</span>
                <span className="path-arrow">→</span>
                <span className="path-label path-label--srv">Server</span>
              </p>
              <p className="hero-panel__meta">Shortest path · 22ms total delay</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-stack" aria-label="Tech stack">
        {STACK.map((item) => (
          <span key={item.label} className={`stack-badge stack-badge--${item.tone}`}>
            <span className="stack-badge__icon">{item.icon}</span>
            {item.label}
          </span>
        ))}
      </section>

      <section id="features" className="landing-features">
        <span className="landing-pill landing-pill--features">Powerful Features</span>
        <h2 className="landing-features__title">
          Everything <span className="landing-gradient-text">recruiters</span> want to see
        </h2>
        <p className="landing-section__sub">
          Algorithms, APIs, auth, and a polished UI — not just a static diagram tool.
        </p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className={`feature-card feature-card--${f.accent}`}>
              <span className="feature-card__num">{f.num}</span>
              <div className="feature-card__row">
                <span className="feature-card__icon-wrap" aria-hidden>
                  {f.icon}
                </span>
                <div className="feature-card__content">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="landing-steps">
        <div className="landing-steps__grid">
          <div className="landing-steps__copy">
            <span className="landing-pill landing-pill--steps">Easy Steps</span>
            <h2>How it works</h2>
            <ol className="steps-timeline">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className={`steps-timeline__item steps-timeline__item--${step.accent}`}
                >
                  <div className="steps-timeline__marker">
                    <span className="steps-timeline__icon">{step.icon}</span>
                    {index < STEPS.length - 1 && (
                      <span className="steps-timeline__line" aria-hidden />
                    )}
                  </div>
                  <div className="steps-timeline__text">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="landing-steps__visual" aria-hidden>
            <div className="network-scene">
              <div className="network-scene__stars" />
              <div className="network-scene__platform" />
              <svg className="network-scene__svg" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#9d50bb" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <line x1="200" y1="160" x2="80" y2="90" stroke="url(#linkGrad)" strokeWidth="2" filter="url(#glow)" />
                <line x1="200" y1="160" x2="320" y2="90" stroke="url(#linkGrad)" strokeWidth="2" filter="url(#glow)" />
                <line x1="200" y1="160" x2="70" y2="220" stroke="url(#linkGrad)" strokeWidth="2" filter="url(#glow)" />
                <line x1="200" y1="160" x2="330" y2="220" stroke="url(#linkGrad)" strokeWidth="2" filter="url(#glow)" />
                <circle cx="200" cy="160" r="28" fill="#0f172a" stroke="#00d2ff" strokeWidth="2" filter="url(#glow)" />
                <text x="200" y="166" textAnchor="middle" fill="#00d2ff" fontSize="14">
                  ⬡
                </text>
                <rect x="55" y="70" width="50" height="36" rx="6" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="80" y="93" textAnchor="middle" fill="#93c5fd" fontSize="11">
                  PC
                </text>
                <rect x="295" y="70" width="50" height="36" rx="6" fill="#0f172a" stroke="#c084fc" strokeWidth="1.5" />
                <text x="320" y="93" textAnchor="middle" fill="#d8b4fe" fontSize="11">
                  SRV
                </text>
                <rect x="45" y="205" width="50" height="36" rx="6" fill="#0f172a" stroke="#f87171" strokeWidth="1.5" />
                <text x="70" y="228" textAnchor="middle" fill="#fca5a5" fontSize="10">
                  FW
                </text>
                <rect x="305" y="205" width="50" height="36" rx="6" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
                <text x="330" y="228" textAnchor="middle" fill="#6ee7b7" fontSize="10">
                  SW
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
