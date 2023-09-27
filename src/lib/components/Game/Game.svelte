<script>
	import { tags } from '$lib/stores/gameStore';

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
	};
</script>

<div class="container">
	<h1>title</h1>
	<button on:click={handlePull} disabled={selectedTags.length < 3}>interact</button>
	{#each $tags as tag}
		<button
			on:click={() => handleTagSelect(tag)}
			disabled={selectedTags.length === 3 && !selectedTags.includes(tag)}
			class={selectedTags.includes(tag) ? 'tag__selected' : ''}>{tag}</button
		>
	{/each}
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
