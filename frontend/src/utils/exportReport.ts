import type { SimulationReport } from "../types/simulation";

export function downloadSimulationReport(report: SimulationReport): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `simulation-report-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
