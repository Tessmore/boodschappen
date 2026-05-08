import { browser } from '$app/environment';

export class LocalStorageRepository<T> {
	constructor(private readonly key: string) {}

	read(): T | null {
		if (!browser) return null;
		const raw = window.localStorage.getItem(this.key);
		if (raw === null) return null;
		try {
			return JSON.parse(raw) as T;
		} catch {
			return null;
		}
	}

	write(value: T): void {
		if (!browser) return;
		window.localStorage.setItem(this.key, JSON.stringify(value));
	}

	clear(): void {
		if (!browser) return;
		window.localStorage.removeItem(this.key);
	}
}
