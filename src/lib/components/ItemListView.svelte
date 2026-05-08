<script lang="ts">
	import { groceryList } from '$lib/state/groceryStore.svelte';

	let mode = $state<'view' | 'edit'>('view');
	let editDraft = $state('');

	function startEdit() {
		editDraft = groceryList.items.map((item) => item.name).join('\n');
		mode = 'edit';
	}

	function saveEdit() {
		groceryList.replaceFromText(editDraft);
		mode = 'view';
	}

	function cancelEdit() {
		mode = 'view';
	}
</script>

{#if groceryList.items.length === 0 && mode === 'view'}
	<p class="empty">Nog geen boodschappen.</p>
{:else if mode === 'view'}
	<ul class="list">
		{#each groceryList.items as item (item.id)}
			<li class:checked={item.checked}>
				<label>
					<input type="checkbox" checked={item.checked} onchange={() => groceryList.toggle(item.id)} />
					<span class="name">{item.name}</span>
				</label>
				<button type="button" class="remove" aria-label="Verwijderen" onclick={() => groceryList.remove(item.id)}>×</button>
			</li>
		{/each}
	</ul>
	<button type="button" class="edit" onclick={startEdit}>Bewerken</button>
{:else}
	<label for="edit-area" class="edit-label">Bewerk lijst (één per regel)</label>
	<textarea id="edit-area" bind:value={editDraft} rows={Math.max(6, editDraft.split('\n').length + 1)}></textarea>
	<div class="edit-actions">
		<button type="button" onclick={cancelEdit}>Annuleren</button>
		<button type="button" class="primary" onclick={saveEdit}>Opslaan</button>
	</div>
{/if}

<style>
	.empty {
		color: #666;
		font-style: italic;
	}
	.list {
		list-style: none;
		padding: 0;
		margin: 0 0 0.75rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.5rem;
		border: 1px solid #ececec;
		border-radius: 6px;
	}
	.list label {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex: 1;
		cursor: pointer;
	}
	.list .checked .name {
		text-decoration: line-through;
		color: #888;
	}
	.remove {
		border: none;
		background: transparent;
		font-size: 1.2rem;
		line-height: 1;
		color: #ef4444;
		cursor: pointer;
		padding: 0 0.4rem;
		border-radius: 4px;
		transition: background-color 0.12s ease, color 0.12s ease;
	}
	.remove:hover {
		color: #dc2626;
		background: #fee2e2;
	}
	.edit, button.primary {
		padding: 0.4rem 0.9rem;
		border-radius: 6px;
		cursor: pointer;
	}
	.edit {
		border: 1px solid #d0d0d0;
		background: white;
		transition: background-color 0.12s ease, border-color 0.12s ease;
	}
	.edit:hover {
		background: #eff6ff;
		border-color: #93c5fd;
	}
	.edit-label {
		font-weight: 600;
		display: block;
		margin-bottom: 0.4rem;
	}
	textarea {
		font: inherit;
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d0d0d0;
		border-radius: 6px;
		resize: vertical;
	}
	.edit-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
		margin-top: 0.5rem;
	}
	.edit-actions button {
		padding: 0.4rem 0.9rem;
		border-radius: 6px;
		cursor: pointer;
		border: 1px solid #d0d0d0;
		background: white;
		transition: background-color 0.12s ease, border-color 0.12s ease;
	}
	.edit-actions button:hover {
		background: #eff6ff;
		border-color: #93c5fd;
	}
	.edit-actions button.primary {
		background: #2563eb;
		color: white;
		border-color: #2563eb;
	}
	.edit-actions button.primary:hover {
		background: #1d4ed8;
		border-color: #1d4ed8;
	}
</style>
