/** Decorative empty-canvas hero (visual only). */
export default function CanvasEmptyState() {
  return (
    <div className="canvas-hero">
      <div className="canvas-hero__rings" aria-hidden>
        <span className="canvas-hero__ring canvas-hero__ring--1" />
        <span className="canvas-hero__ring canvas-hero__ring--2" />
        <span className="canvas-hero__ring canvas-hero__ring--3" />
      </div>
      <div className="canvas-hero__core" aria-hidden>
        <span className="canvas-hero__hex">⬡</span>
      </div>
      <span className="canvas-hero__dot canvas-hero__dot--1" aria-hidden />
      <span className="canvas-hero__dot canvas-hero__dot--2" aria-hidden />
      <span className="canvas-hero__dot canvas-hero__dot--3" aria-hidden />
      <span className="canvas-hero__dot canvas-hero__dot--4" aria-hidden />
      <div className="canvas-hero__copy">
        <h3>Start building your network</h3>
        <p>
          Add devices from the left panel, connect them on the canvas, then run packet
          simulation from the right.
        </p>
      </div>
    </div>
  );
}
