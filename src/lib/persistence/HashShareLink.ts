import { browser } from '$app/environment';
import type { Codec } from '$lib/serialization/Codec';

const HASH_KEY = 'data';

export class HashShareLink {
	constructor(private readonly codec: Codec<unknown>) {}

	async consume(): Promise<unknown | null> {
		if (!browser) return null;
		const encoded = readHashParam(HASH_KEY);
		if (!encoded) return null;
		// Clear the hash so a refresh after editing the imported list
		// doesn't reapply the original share blob and overwrite edits.
		clearHash();
		try {
			return await this.codec.decode(encoded);
		} catch {
			return null;
		}
	}

	async buildUrl(value: unknown): Promise<string> {
		const encoded = await this.codec.encode(value);
		const { origin, pathname, search } = window.location;
		return `${origin}${pathname}${search}#${HASH_KEY}=${encoded}`;
	}

	async copyToClipboard(value: unknown): Promise<boolean> {
		if (!browser || !navigator.clipboard) return false;
		const url = await this.buildUrl(value);
		try {
			await navigator.clipboard.writeText(url);
			return true;
		} catch {
			return false;
		}
	}
}

function readHashParam(key: string): string | null {
	const hash = window.location.hash.replace(/^#/, '');
	if (!hash) return null;
	const params = new URLSearchParams(hash);
	return params.get(key);
}

function clearHash() {
	const { pathname, search } = window.location;
	window.history.replaceState(null, '', `${pathname}${search}`);
}
