/** Full-page mesh + ambient glow for auth screens (login / register). */
export default function AuthBackground() {
  const nodes: [number, number][] = [
    [8, 12], [22, 8], [38, 15], [55, 10], [72, 18], [88, 8], [95, 25],
    [12, 35], [28, 42], [45, 38], [62, 45], [78, 32], [92, 48],
    [5, 58], [20, 65], [35, 55], [50, 62], [68, 58], [85, 68], [98, 55],
    [15, 78], [32, 85], [48, 72], [65, 82], [80, 75], [94, 88],
    [10, 92], [42, 95], [58, 90], [75, 95], [90, 78],
  ];

  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [0, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 6],
    [7, 12], [12, 13], [13, 14], [14, 15], [15, 16],
    [12, 17], [17, 18], [18, 19], [19, 20],
    [17, 21], [21, 22], [22, 23], [23, 24], [24, 25],
    [21, 26], [26, 27], [27, 28], [28, 29], [29, 20],
    [8, 13], [13, 22], [3, 10], [10, 15], [15, 23],
  ];

  return (
    <div className="auth-bg" aria-hidden>
      <div className="auth-bg__orb auth-bg__orb--cyan" />
      <div className="auth-bg__orb auth-bg__orb--purple" />
      <div className="auth-bg__orb auth-bg__orb--blue" />

      <svg className="auth-bg__mesh" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="authMeshLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <g className="auth-bg__mesh-lines">
          {edges.map(([a, b], i) => (
            <line
              key={`e-${i}`}
              x1={nodes[a][0]}
              y1={nodes[a][1]}
              x2={nodes[b][0]}
              y2={nodes[b][1]}
              stroke="url(#authMeshLine)"
              strokeWidth="0.15"
              style={{ animationDelay: `${(i % 7) * 0.35}s` }}
            />
          ))}
        </g>
        <g className="auth-bg__mesh-dots">
          {nodes.map(([x, y], i) => (
            <circle
              key={`n-${i}`}
              cx={x}
              cy={y}
              r="0.35"
              fill="#3b82f6"
              style={{ animationDelay: `${(i % 5) * 0.4}s` }}
            />
          ))}
        </g>
      </svg>

      <div className="auth-bg__grain" />
    </div>
  );
}
