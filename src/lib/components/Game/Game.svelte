<script>
	import { fetchTagsFromDB } from '$lib/services/tagService.js';

	let selectedTags = [];

	const handleTagSelect = (tag) => {
		// remove if already in list, otherwise add
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
		console.log(tag);
	};

	const handlePull = () => {
		console.log(selectedTags);
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
</style>
