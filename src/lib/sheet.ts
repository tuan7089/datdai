import type { Dat, Khach } from '../types';

// ⚠️ TODO: thay bằng URL Apps Script Web App của bạn:
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbz8mQ-0isqrzl3d-_K2soM5SIGcX8WZ5ljyq_-Qle6t30YcKmFfoW9YjMnsfAg6h7a0cA/exec';

type ApiResponse<T> = { ok: boolean; data?: T; error?: string };

// Code build thì sẽ như này

async function api<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.ok) throw new Error(json.error || 'Unknown error');
  return json.data as T;
}


// Code qua proxy khi chưa live web
// async function api<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
//   const proxy = "https://datdai-proxy-nextjs-boilerplate.vercel.app/api/proxy" // dev: const proxy :::: Khi live sẽ "thay" proxy "bằng" ENDPOINT và xoá  chỗ body khi gửi đi
//   const res = await fetch(proxy, { // Edit 1 thay ENDPOINT = proxy
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ action, ENDPOINT, ...payload }), // Edit 2 Thêm ENDPOINT
//   });
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   const json = (await res.json()) as ApiResponse<T>;
//   if (!json.ok) throw new Error(json.error || 'Unknown error');
//   return json.data as T;
// }

// Khach
export function listKhach(): Promise<Khach[]> {
  return api<Khach[]>('khach_list');
}
export function upsertKhach(item: Khach): Promise<Khach> {
  return api<Khach>('khach_upsert', { item });
}
export function deleteKhach(id: string): Promise<boolean> {
  return api<boolean>('khach_delete', { id });
}

// Dat
export function listDat(): Promise<Dat[]> {
  return api<Dat[]>('dat_list');
}
export function upsertDat(item: Dat): Promise<Dat> {
  return api<Dat>('dat_upsert', { item });
}
export function deleteDat(id: string): Promise<boolean> {
  return api<boolean>('dat_delete', { id });
}
