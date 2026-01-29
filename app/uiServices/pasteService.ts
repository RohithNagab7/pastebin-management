import { apiFetch } from "@/lib/api";

export async function createPaste(payload: {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}) {
  return apiFetch("/api/pastes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchPaste(id: string) {
  return apiFetch(`/api/pastes/${id}`, {
    method: "GET",
  });
}
