<script>
	import { onMount } from 'svelte';
	import { getImageUrl } from '$lib/services/fileService.js';
	import { fetchSubmissionById } from '$lib/services/submissionService.js';

	let entities = [];

	onMount(() => {
		getAllEntities();
	});

	const getAllEntities = () => {
		const userData = JSON.parse(localStorage.getItem('userData'));
		if (!userData) return;
		const entityData = userData.ownedEntities || [];
		console.log(entityData);
		entities = entityData;
	};
</script>

<div>
	<h1>entity list</h1>
	<div class="cards">
		{#each entities as e}
			<div class="card">
				{#await fetchSubmissionById(e.id)}
					<span>loading...</span>
				{:then submission}
					{#await getImageUrl(submission.entityImgRef)}
						<span>loading...</span>
					{:then url}
						<img src={url} class="entityImg" alt={submission.entityName} />
					{:catch error}
						<span>error: {error.message}</span>
					{/await}
					<p>{submission.entityName}</p>
					<p>{e.duplicates} dups</p>
					<p>level {e.currentLevel}</p>
				{:catch error}
					<span>error: {error.message}</span>
				{/await}
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
	.card * {
		margin: 0;
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
