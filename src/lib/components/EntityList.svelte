<script>
	import { getImageUrl } from '$lib/services/fileService.js';
	import { onMount } from 'svelte';

	let entities = [];

	onMount(() => {
		getAllEntities();
	});

	const getAllEntities = () => {
		const data = JSON.parse(localStorage.getItem('pullHistory')) || [];
		entities = data;
	};
</script>

<div>
	<h1>entity list</h1>
	<div class="cards">
		{#each entities as e}
			<div class="card">
				{#await getImageUrl(e.pullResult.entityImgRef)}
					<span>loading...</span>
				{:then url}
					<img src={url} class="entityImg" alt={e.pullResult.entityName} />
				{:catch error}
					<span>error: {error.message}</span>
				{/await}
				<p>{e.pullResult.entityName}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.cards {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 200px;
		background-color: rgb(181, 181, 181);
		border-radius: 4px;
		padding: 6px;
	}

	.entityImg {
		max-width: 150px;
		max-height: 150px;
		overflow: hidden;
	}
</style>
