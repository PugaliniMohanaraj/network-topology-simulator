/** Isometric network scene for auth left panel — matches sign-in mockup. */
export default function AuthNetworkIllustration() {
  return (
    <div className="auth-scene" aria-hidden>
      <div className="auth-scene__platform" />
      <div className="auth-scene__sparkles" />

      <svg className="auth-scene__svg" viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="authLinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="authNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="authHubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="240" cy="200" rx="120" ry="28" fill="url(#authHubGlow)" opacity="0.7" />

        <path id="authPathTL" d="M240 168 L340 95" fill="none" />
        <path id="authPathBL" d="M240 168 L95 210" fill="none" />
        <path id="authPathBC" d="M240 168 L240 248" fill="none" />
        <path id="authPathBR" d="M240 168 L385 210" fill="none" />

        <line x1="240" y1="168" x2="340" y2="95" stroke="url(#authLinkGrad)" strokeWidth="2" strokeDasharray="8 6" className="auth-link-line" filter="url(#authNeonGlow)" />
        <line x1="240" y1="168" x2="95" y2="210" stroke="url(#authLinkGrad)" strokeWidth="2" strokeDasharray="8 6" className="auth-link-line auth-link-line--delay1" filter="url(#authNeonGlow)" />
        <line x1="240" y1="168" x2="240" y2="248" stroke="url(#authLinkGrad)" strokeWidth="2" strokeDasharray="8 6" className="auth-link-line auth-link-line--delay2" filter="url(#authNeonGlow)" />
        <line x1="240" y1="168" x2="385" y2="210" stroke="url(#authLinkGrad)" strokeWidth="2" strokeDasharray="8 6" className="auth-link-line auth-link-line--delay3" filter="url(#authNeonGlow)" />

        <circle r="5" fill="#00f2ff" filter="url(#authNeonGlow)">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M240,168 L340,95" />
        </circle>
        <circle r="4" fill="#60a5fa" filter="url(#authNeonGlow)">
          <animateMotion dur="2.6s" repeatCount="indefinite" begin="0.3s" path="M240,168 L95,210" />
        </circle>
        <circle r="4" fill="#fb923c" filter="url(#authNeonGlow)">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.6s" path="M240,168 L240,248" />
        </circle>
        <circle r="5" fill="#a855f7" filter="url(#authNeonGlow)">
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.9s" path="M240,168 L385,210" />
        </circle>

        {/* Laptop — bottom left */}
        <g className="auth-node auth-node--laptop">
          <path d="M72 198 L118 178 L118 218 L72 238 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M76 202 L114 186 L114 212 L76 228 Z" fill="#1e293b" stroke="#60a5fa" strokeWidth="1" opacity="0.9" />
          <rect x="88" y="192" width="22" height="14" rx="2" fill="#0ea5e9" opacity="0.35" />
          <path d="M68 240 L122 218" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
        </g>

        {/* Router — bottom center */}
        <g className="auth-node auth-node--router">
          <circle cx="240" cy="258" r="22" fill="#0f172a" stroke="#fb923c" strokeWidth="2" filter="url(#authNeonGlow)" />
          <circle cx="240" cy="258" r="8" fill="none" stroke="#fdba74" strokeWidth="1.5" />
          <circle cx="240" cy="258" r="3" fill="#fb923c" />
        </g>

        {/* Server rack — bottom right */}
        <g className="auth-node auth-node--server">
          <rect x="358" y="178" width="44" height="58" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
          <line x1="366" y1="192" x2="394" y2="192" stroke="#c084fc" strokeWidth="2" opacity="0.8" />
          <line x1="366" y1="204" x2="394" y2="204" stroke="#c084fc" strokeWidth="2" opacity="0.6" />
          <line x1="366" y1="216" x2="394" y2="216" stroke="#c084fc" strokeWidth="2" opacity="0.5" />
          <circle cx="370" cy="188" r="2" fill="#22c55e" />
          <circle cx="370" cy="200" r="2" fill="#22c55e" />
          <circle cx="370" cy="212" r="2" fill="#eab308" />
        </g>

        {/* Switch / AP — top right */}
        <g className="auth-node auth-node--switch">
          <rect x="318" y="72" width="52" height="36" rx="6" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
          <circle cx="332" cy="90" r="3" fill="#34d399" />
          <circle cx="344" cy="90" r="3" fill="#34d399" />
          <circle cx="356" cy="90" r="3" fill="#34d399" />
          <path d="M330 98 h28" stroke="#6ee7b7" strokeWidth="1.5" />
        </g>

        {/* Central hub hexagon */}
        <g className="auth-hub">
          <polygon
            points="240,138 262,150 262,174 240,186 218,174 218,150"
            fill="#0f172a"
            stroke="#00f2ff"
            strokeWidth="2"
            filter="url(#authNeonGlow)"
          />
          <text x="240" y="168" textAnchor="middle" fill="#00f2ff" fontSize="20" fontWeight="600">
            ⬡
          </text>
        </g>
      </svg>
    </div>
  );
}
