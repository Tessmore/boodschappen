import { browser } from '$app/environment';
import { GroceryList, type SerializedList } from '$lib/domain/GroceryList.svelte';
import { LocalStorageRepository } from '$lib/persistence/LocalStorageRepository';
import { HashShareLink } from '$lib/persistence/HashShareLink';
import { GzipBase64UrlCodec } from '$lib/serialization/GzipBase64UrlCodec';

const STORAGE_KEY = 'boodschappen:list';

export const groceryList = new GroceryList();
export const shareLink = new HashShareLink(new GzipBase64UrlCodec());

const storage = new LocalStorageRepository<SerializedList>(STORAGE_KEY);
let hydrated = $state(false);

export const isHydrated = () => hydrated;

if (browser) {
	$effect.root(() => {
		// Load localStorage synchronously first so a slow or failed hash
		// decode can never overwrite the user's saved list with empty defaults.
		const stored = storage.read();
		if (stored) groceryList.loadFrom(stored);

		shareLink.consume().then((shared) => {
			if (shared) groceryList.loadFrom(shared);
			hydrated = true;
		});

		$effect(() => {
			if (!hydrated) return;
			storage.write(groceryList.toJSON());
		});
	});
}
