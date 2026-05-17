interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: "Delete / Backspace", action: "Remove selected node" },
  { keys: "Scroll", action: "Zoom canvas" },
  { keys: "Drag canvas", action: "Pan view" },
  { keys: "Drag handle", action: "Create link between devices" },
];

export default function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="help-title"
      >
        <div className="modal__header">
          <h2 id="help-title">Keyboard & Tips</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <ul className="shortcut-list">
          {SHORTCUTS.map((s) => (
            <li key={s.keys}>
              <kbd>{s.keys}</kbd>
              <span>{s.action}</span>
            </li>
          ))}
        </ul>
        <p className="modal__tip">
          Load a <strong>demo template</strong> from the sidebar, set source & destination,
          then run simulation to see Dijkstra routing and packet animation.
        </p>
      </div>
    </div>
  );
}
