<script lang="ts">
	import { groceryList } from '$lib/state/groceryStore.svelte';

	let draft = $state('');

	function commit() {
		if (draft.trim().length === 0) return;
		groceryList.addFromText(draft);
		draft = '';
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			commit();
		}
	}
</script>

<form class="adder" onsubmit={(e) => { e.preventDefault(); commit(); }}>
	<textarea
		id="adder-input"
		bind:value={draft}
		onkeydown={onKeydown}
		placeholder={'Een item per regel\nMelk\nBrood\nKaas'}
		rows="4"
	></textarea>
	<div class="row">
		<small></small>
		<button type="submit" disabled={draft.trim().length === 0}>Toevoegen</button>
	</div>
</form>

<style>
	.adder {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	label {
		font-weight: 600;
	}
	textarea {
		font: inherit;
		padding: 0.5rem;
		border: 1px solid #d0d0d0;
		border-radius: 6px;
		resize: vertical;
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}
	small {
		color: #666;
	}
	button {
		padding: 0.4rem 0.9rem;
		border: 1px solid #2563eb;
		background: #2563eb;
		color: white;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.12s ease, border-color 0.12s ease;
	}
	button:hover:not(:disabled) {
		background: #1d4ed8;
		border-color: #1d4ed8;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
