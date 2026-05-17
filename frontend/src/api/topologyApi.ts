import { apiClient } from "./client";
import type { SavedTopology, SavedTopologyPayload } from "../types/topology";

export async function fetchTopologies(): Promise<SavedTopology[]> {
  const { data } = await apiClient.get<SavedTopology[]>("/api/topologies");
  return data;
}

export async function saveTopology(
  payload: SavedTopologyPayload,
): Promise<SavedTopology> {
  const { data } = await apiClient.post<SavedTopology>("/api/topologies", payload);
  return data;
}

export async function updateTopology(
  id: number,
  payload: SavedTopologyPayload,
): Promise<SavedTopology> {
  const { data } = await apiClient.put<SavedTopology>(`/api/topologies/${id}`, payload);
  return data;
}

export async function loadTopology(id: number): Promise<SavedTopology> {
  const { data } = await apiClient.get<SavedTopology>(`/api/topologies/${id}`);
  return data;
}

export async function deleteTopology(id: number): Promise<void> {
  await apiClient.delete(`/api/topologies/${id}`);
}
