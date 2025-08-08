import { writable } from 'svelte/store';
import type { Dat } from './types';

const STORAGE_KEY = 'danhSachDat';

function createDatListStore() {
	const stored = localStorage.getItem(STORAGE_KEY);
	const initial: Dat[] = stored ? JSON.parse(stored) : [];

	const { subscribe, set, update } = writable<Dat[]>(initial);

	subscribe((value) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	});

	return {
		subscribe,
		set,
		update,
		add: (dat: Dat) => update((list) => [...list, dat]),
		remove: (id: string) => update((list) => list.filter((d) => d.id !== id)),
		edit: (dat: Dat) =>
			update((list) =>
				list.map((d) => (d.id === dat.id ? { ...d, ...dat } : d))
			),
		clear: () => set([]),
	};
}

export const datList = createDatListStore();
