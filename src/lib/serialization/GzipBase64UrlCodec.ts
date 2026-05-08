import { fromBase64Url, toBase64Url } from './base64url';
import { CodecError, type Codec } from './Codec';

export class GzipBase64UrlCodec implements Codec<unknown> {
	async encode(value: unknown): Promise<string> {
		const json = JSON.stringify(value);
		const utf8 = new TextEncoder().encode(json);
		const gzipped = await pipeThrough(utf8, new CompressionStream('gzip'));
		return toBase64Url(gzipped);
	}

	async decode(encoded: string): Promise<unknown> {
		try {
			const gzipped = fromBase64Url(encoded);
			const utf8 = await pipeThrough(gzipped, new DecompressionStream('gzip'));
			const json = new TextDecoder().decode(utf8);
			return JSON.parse(json);
		} catch (cause) {
			throw new CodecError('failed to decode gzip+base64url payload', { cause });
		}
	}
}

async function pipeThrough(input: Uint8Array, transform: GenericTransformStream): Promise<Uint8Array> {
	const stream = new Blob([input as BlobPart]).stream().pipeThrough(transform);
	const buffer = await new Response(stream).arrayBuffer();
	return new Uint8Array(buffer);
}
