<script>
	import { fetchTagsFromDB } from '$lib/services/tagService.js';
	import { fetchRandomValidEntity } from '$lib/services/submissionService.js';
	import { getImageUrl } from '$lib/services/fileService.js';

	let selectedTags = [];
	let result;

	const handleTagSelect = (tag) => {
		// remove if already in list, otherwise add
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
		console.log(tag);
	};

	const handlePull = async () => {
		const selectedTagIds = selectedTags.map((tag) => tag.id);
		const pullResult = await fetchRandomValidEntity(selectedTagIds);

		const pullDetails = {
			selectedTagIds,
			pullResult,
			timestamp: Date.now()
		};
		// save to local storage
		localStorage.getItem('pullHistory')
			? localStorage.setItem(
					'pullHistory',
					JSON.stringify([...JSON.parse(localStorage.getItem('pullHistory')), pullDetails])
			  )
			: localStorage.setItem('pullHistory', JSON.stringify([pullDetails]));

		console.log(pullResult);
		result = pullResult;
		selectedTags = [];
	};
</script>

<div class="container">
	<h1>title</h1>

	<button on:click={handlePull} disabled={selectedTags.length < 3}>interact</button>

	{#await fetchTagsFromDB()}
		<p>Loading...</p>
	{:then tags}
		{#each tags as tag}
			<button
				on:click={() => handleTagSelect(tag)}
				disabled={selectedTags.length === 3 && !selectedTags.includes(tag)}
				class={selectedTags.includes(tag) ? 'tag__selected' : ''}>{tag.name} - {tag.id}</button
			>
		{/each}
	{/await}

	{#if result}
		<div class="col">
			{#await getImageUrl(result.entityImgRef)}
				<span>loading...</span>
			{:then url}
				<img src={url} class="entityImg" alt={result.entityName} />
			{:catch error}
				<span>error: {error.message}</span>
			{/await}
			{result.entityName}
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.tag__selected {
		font-weight: bold;
	}

	.entityImg {
		max-width: 100px;
		max-height: 100px;
		overflow: hidden;
	}

	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
