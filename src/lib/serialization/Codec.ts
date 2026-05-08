export interface Codec<T> {
	encode(value: T): Promise<string>;
	decode(encoded: string): Promise<T>;
}

export class CodecError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = 'CodecError';
	}
}
