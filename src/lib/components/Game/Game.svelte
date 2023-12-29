<script>
	import { getTagsToday } from '$lib/services/tagService.js';
	import { fetchRandomValidEntity } from '$lib/services/submissionService.js';
	import { getImageUrl } from '$lib/services/fileService.js';
	import EntityList from '$lib/components/EntityList.svelte';
	import { getRarityName, getRarityStar, getRarityProgress } from '$lib/utils/entityUtils.js';
	import UserCurrency from '$lib/components/UserCurrency.svelte';

	const NUM_TAGS = 3;
	const NUM_SELECTABLE_TAGS = 2;
	const DUP_SHARD_AMT = 5;
	const MAXED_DUP_SHARD_AMT = 20;
	const MAX_DUP_COUNT = 15;

	let selectedTags = [];
	let result;
	let shards = 0;
	let dupCount = 0;

	const handleTagSelect = (tag) => {
		// remove if already in list, otherwise add
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	};

	// check if there is already a result for today in local storage
	const pullResultToday = () => {
		const data = localStorage.getItem('pullResultToday');
		if (data) {
			const { pullResult } = JSON.parse(data);
			console.log(pullResult);
			result = pullResult;
			return false;
		}
		return false;
	};

	// TODO: move to service
	const saveResultToLocalStorage = (result, selectedTagIds) => {
		const pullResultData = {
			pullResult: result,
			selectedTagIds,
			date: new Date().toLocaleDateString()
		};
		localStorage.setItem('pullResultToday', JSON.stringify(pullResultData)); // TODO - no longer needed ?
		// save data to pull history
		let arr = JSON.parse(localStorage.getItem('pullHistory')) || [];
		arr.push(pullResultData);
		localStorage.setItem('pullHistory', JSON.stringify(arr));

		// save data to user data
		let userData = JSON.parse(localStorage.getItem('userData')) || {};
		let ownedEntities = userData.ownedEntities || [];
		let entityData = ownedEntities.find((c) => c.id === result.id);
		if (entityData) {
			// user already owns entity
			if (entityData.duplicates === MAX_DUP_COUNT) {
				shards = MAXED_DUP_SHARD_AMT;
			} else {
				entityData.duplicates++;
				shards = DUP_SHARD_AMT;
			}
			// update entity data
			ownedEntities = ownedEntities.map((e) => (e.id === result.id ? entityData : e));
		} else {
			// user doesn't own entity
			entityData = {
				id: result.id,
				duplicates: 0,
				currentExp: 0,
				currentLevel: 0,
				dateAcquired: new Date().toLocaleDateString()
			};
			ownedEntities.push(entityData);
		}
		dupCount = entityData.duplicates; // TODO - specify if a pulled entity is already maxed out
		userData.ownedEntities = ownedEntities;
		if (!userData.currencies) userData.currencies = { shards: 0 };
		userData.currencies.shards += shards;
		localStorage.setItem('userData', JSON.stringify(userData));
	};

	const handlePull = async () => {
		const selectedTagIds = selectedTags.map((tag) => tag.id);
		const res = await fetchRandomValidEntity(selectedTagIds);
		result = res;
		saveResultToLocalStorage(res, selectedTagIds);
		selectedTags = [];
	};

	const handleReset = () => {
		result = null;
		selectedTags = [];
		localStorage.removeItem('pullResultToday');
		localStorage.removeItem('tagsToday');
		location.reload();
	};

	// exclude pullResultToday() from reactive statement {#if} to prevent triggering infinite re-renders
	const hasPulledToday = pullResultToday();
</script>

<div class="container">
	<h1>title</h1>

	<UserCurrency />

	<button on:click={handleReset}>reset</button>

	{#if hasPulledToday || result}
		<div class="col">
			{#await getImageUrl(result.entityImgRef)}
				<span>loading...</span>
			{:then url}
				<div>
					<img src={url} class="entityImg" alt={result.entityName} />
				</div>
			{:catch error}
				<span>error: {error.message}</span>
			{/await}
			<p>{result.entityName}</p>
			<p>{getRarityName(dupCount)} - {dupCount} dups total</p>
			{#if shards > 0}
				<p>+{shards} shards</p>
			{/if}
		</div>
	{:else}
		<button on:click={handlePull} disabled={selectedTags.length < NUM_SELECTABLE_TAGS}
			>interact</button
		>

		{#await getTagsToday(NUM_TAGS)}
			<p>Loading...</p>
		{:then tags}
			{#each tags as tag}
				<button
					on:click={() => handleTagSelect(tag)}
					disabled={selectedTags.length === NUM_SELECTABLE_TAGS && !selectedTags.includes(tag)}
					class={selectedTags.includes(tag) ? 'tag__selected' : ''}>{tag.name} - {tag.id}</button
				>
			{/each}
		{/await}
	{/if}

	<EntityList />
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
		max-width: 150px;
		max-height: 150px;
		overflow: hidden;
	}

	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
