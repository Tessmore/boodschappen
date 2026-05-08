export class ItemName {
	readonly value: string;

	private constructor(value: string) {
		this.value = value;
	}

	static of(raw: string): ItemName {
		return new ItemName(raw.trim());
	}

	static tryOf(raw: string): ItemName | null {
		const trimmed = raw.trim();
		return trimmed.length === 0 ? null : new ItemName(trimmed);
	}

	equals(other: ItemName): boolean {
		return this.value.localeCompare(other.value, 'nl', { sensitivity: 'accent' }) === 0;
	}

	toString(): string {
		return this.value;
	}
}
