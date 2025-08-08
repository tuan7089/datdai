export function getCache<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCache<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}
