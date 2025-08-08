import { writable } from 'svelte/store';

export const currentPath = writable(window.location.pathname);

export function navigate(path: string) {
  history.pushState({}, '', path);
  currentPath.set(path);
}

// Bắt sự kiện nút back/forward trình duyệt
window.addEventListener('popstate', () => {
  currentPath.set(window.location.pathname);
});
