<script lang="ts">
	import ItemAdder from '$lib/components/ItemAdder.svelte';
	import ItemListView from '$lib/components/ItemListView.svelte';
	import ToolbarActions from '$lib/components/ToolbarActions.svelte';
</script>

<svelte:head>
	<title>Boodschappen</title>
</svelte:head>

<main>
	<header>
		<h1>Boodschappen</h1>
	</header>

	<section class="panel">
		<ItemAdder />
	</section>

	<section class="panel">
		<ItemListView />
	</section>

	<section class="panel">
		<ToolbarActions />
	</section>
</main>

<style>
	main {
		max-width: 38rem;
		margin: 2rem auto;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: system-ui, sans-serif;
		color: #222;
	}
	header h1 {
		margin: 0;
		font-size: 1.6rem;
	}
	.panel {
		background: white;
		border: 1px solid #ececec;
		border-radius: 8px;
		padding: 1rem;
	}
	:global(body) {
		margin: 0;
		background: #f7f7f8;
	}
</style>
