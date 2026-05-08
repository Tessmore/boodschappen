import { Item, type SerializedItem } from './Item.svelte';
import { ItemName } from './ItemName';

export type SerializedList = { v: 1; items: SerializedItem[] };

const SCHEMA_VERSION = 1;

export class GroceryList {
	items = $state<Item[]>([]);

	addFromText(text: string) {
		const additions = parseLines(text).map((name) => new Item(newId(), name.value));
		if (additions.length > 0) this.items = [...this.items, ...additions];
	}

	replaceFromText(text: string) {
		const previousByName = new Map(this.items.map((item) => [item.itemName().value.toLowerCase(), item]));
		const merged = parseLines(text).map((name) => {
			const existing = previousByName.get(name.value.toLowerCase());
			return existing ?? new Item(newId(), name.value);
		});
		this.items = merged;
	}

	sortAlphabetically() {
		this.items = [...this.items].sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }));
	}

	toggle(id: string) {
		this.items.find((item) => item.id === id)?.toggle();
	}

	remove(id: string) {
		this.items = this.items.filter((item) => item.id !== id);
	}

	clear() {
		this.items = [];
	}

	toJSON(): SerializedList {
		return { v: SCHEMA_VERSION, items: this.items.map((item) => item.toJSON()) };
	}

	loadFrom(data: unknown) {
		this.items = parseSerializedList(data).map(({ n, c }) => new Item(newId(), n, c ?? false));
	}
}

function parseLines(text: string): ItemName[] {
	return text
		.split(/\r?\n/)
		.map((line) => ItemName.tryOf(line))
		.filter((name): name is ItemName => name !== null);
}

function parseSerializedList(data: unknown): SerializedItem[] {
	if (!data || typeof data !== 'object') return [];
	const record = data as Partial<SerializedList>;
	if (record.v !== SCHEMA_VERSION || !Array.isArray(record.items)) return [];
	return record.items.filter(
		(entry): entry is SerializedItem => !!entry && typeof entry === 'object' && typeof (entry as SerializedItem).n === 'string'
	);
}

function newId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
	return `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}
