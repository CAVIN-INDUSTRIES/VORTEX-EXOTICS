import type { AnalyticsResponse } from "@vex/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function unwrap(payload: unknown): any {
  if (payload && typeof payload === "object" && "data" in (payload as Record<string, unknown>)) {
    return (payload as { data: any }).data;
  }
  return payload as any;
}

export async function login(email: string, password: string): Promise<{ user: { role: string }; token: string }> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error("Cannot reach API. Is it running at " + API_BASE + "?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && typeof data.message === "string") ? data.message : "Login failed";
    throw new Error(msg);
  }
  return data;
}

export async function getMe(token: string): Promise<{ role: string }> {
  const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

export async function getDashboardStats(token: string) {
  const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json();
}

export async function getAnalytics(token: string): Promise<AnalyticsResponse> {
  const res = await fetch(`${API_BASE}/analytics`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load analytics");
  return unwrap(await res.json()) as AnalyticsResponse;
}

export async function getLeads(token: string, params?: { status?: string }) {
  const q = params?.status ? `?status=${params.status}` : "";
  const res = await fetch(`${API_BASE}/leads${q}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load leads");
  return unwrap(await res.json());
}

export async function getLead(token: string, id: string) {
  const res = await fetch(`${API_BASE}/leads/${id}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load lead");
  return unwrap(await res.json());
}

export async function createLead(
  token: string,
  data: { source?: string; name?: string; email?: string; phone?: string; vehicleInterest?: string; notes?: string }
) {
  const res = await fetch(`${API_BASE}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.message === "string" ? err.message : "Failed to create lead");
  }
  return unwrap(await res.json());
}

export async function updateLead(token: string, id: string, data: { status?: string; assignedToId?: string; notes?: string }) {
  const res = await fetch(`${API_BASE}/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update lead");
  return unwrap(await res.json());
}

export async function getOrders(token: string, params?: { status?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  const res = await fetch(`${API_BASE}/orders?${q}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load orders");
  return unwrap(await res.json());
}

export async function getOrder(token: string, id: string) {
  const res = await fetch(`${API_BASE}/orders/${id}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load order");
  return unwrap(await res.json());
}

export async function updateOrderStatus(token: string, id: string, status: string) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return unwrap(await res.json());
}

export async function getInventory(token: string, params?: { status?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  const res = await fetch(`${API_BASE}/inventory?${q}&limit=100`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load inventory");
  return unwrap(await res.json());
}

export async function getCustomers(token: string) {
  const res = await fetch(`${API_BASE}/customers?limit=100`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load customers");
  return unwrap(await res.json());
}

export async function getCustomer(token: string, id: string) {
  const res = await fetch(`${API_BASE}/customers/${id}`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load customer");
  return unwrap(await res.json());
}

export async function getCurrentTenantBilling(token: string) {
  const res = await fetch(`${API_BASE}/pricing/current`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to load billing tier");
  return unwrap(await res.json());
}

export async function createCustomer(
  token: string,
  data: { name?: string; email?: string; phone?: string }
) {
  const res = await fetch(`${API_BASE}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return unwrap(await res.json());
}

export async function createInventoryItem(
  token: string,
  data: { source: "COMPANY" | "PRIVATE_SELLER"; vehicleId: string; listPrice: number; location?: string; mileage?: number; vin?: string }
) {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create inventory item");
  return unwrap(await res.json());
}

export async function createOrder(
  token: string,
  data: { type: "INVENTORY" | "CUSTOM_BUILD"; userId?: string; inventoryId?: string; vehicleId?: string; totalAmount?: number }
) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return unwrap(await res.json());
}
