import { ItemName } from './ItemName';

export type SerializedItem = { n: string; c?: boolean };

export class Item {
	readonly id: string;
	name = $state('');
	checked = $state(false);

	constructor(id: string, name: string, checked = false) {
		this.id = id;
		this.name = name;
		this.checked = checked;
	}

	toggle() {
		this.checked = !this.checked;
	}

	rename(newName: string) {
		const next = ItemName.tryOf(newName);
		if (next) this.name = next.value;
	}

	itemName(): ItemName {
		return ItemName.of(this.name);
	}

	// Short keys keep gzip+base64-url share URLs compact.
	toJSON(): SerializedItem {
		return this.checked ? { n: this.name, c: true } : { n: this.name };
	}
}
