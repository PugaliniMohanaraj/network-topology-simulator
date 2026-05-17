import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../api/client";

export type BackendStatus = "checking" | "online" | "offline";

const POLL_MS = 5000;

export function useBackendStatus(): BackendStatus {
  const [status, setStatus] = useState<BackendStatus>("checking");

  const check = useCallback(() => {
    apiClient
      .get("/api/health", { timeout: 4000 })
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  useEffect(() => {
    check();
    const id = window.setInterval(check, POLL_MS);
    return () => window.clearInterval(id);
  }, [check]);

  return status;
}
