<script lang="ts">
	import { groceryList, shareLink } from '$lib/state/groceryStore.svelte';

	let shareStatus = $state<'idle' | 'copied' | 'failed'>('idle');
	let shareTimer: ReturnType<typeof setTimeout> | null = null;

	async function share() {
		const ok = await shareLink.copyToClipboard(groceryList.toJSON());
		shareStatus = ok ? 'copied' : 'failed';
		if (shareTimer) clearTimeout(shareTimer);
		shareTimer = setTimeout(() => (shareStatus = 'idle'), 2000);
	}

	function clearAll() {
		if (groceryList.items.length === 0) return;
		const ok = confirm('Hele lijst wissen?');
		if (ok) groceryList.clear();
	}
</script>

<div class="toolbar">
	<button type="button" onclick={() => groceryList.sortAlphabetically()} disabled={groceryList.items.length < 2}>
		Sorteer A-Z
	</button>
	<button type="button" onclick={share} disabled={groceryList.items.length === 0}>Deel</button>
	{#if shareStatus === 'copied'}
		<span class="status ok">Link gekopieerd!</span>
	{:else if shareStatus === 'failed'}
		<span class="status err">Kopiëren mislukt</span>
	{/if}

  <span></span>
  <span></span>

	<button type="button" class="danger" onclick={clearAll} disabled={groceryList.items.length === 0}>Wissen</button>
</div>

<style>
	.toolbar {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		flex-wrap: wrap;
	}
	button {
		padding: 0.4rem 0.9rem;
		border: 1px solid #d0d0d0;
		background: white;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.12s ease, border-color 0.12s ease;
	}
	button:hover:not(:disabled) {
		background: #eff6ff;
		border-color: #93c5fd;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	button.danger {
		color: #ef4444;
		border-color: #fecaca;
	}
	button.danger:hover:not(:disabled) {
		background: #fee2e2;
		border-color: #fca5a5;
	}
	.status {
		font-size: 0.9rem;
	}
	.status.ok {
		color: #166534;
	}
	.status.err {
		color: #b91c1c;
	}
</style>
