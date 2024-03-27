<script>
	import {
		fetchedPullResultToday,
		fetchRandomFeaturedEntity,
		addToPullResultHistory,
		updateShardsAndDups
	} from '$lib/services/gachaService.js';
	import { getImageUrl } from '$lib/services/fileService.js';
	import EntityList from '$lib/components/Entity/EntityList.svelte';
	import { getRarityName, getRarityStar, getRarityProgress } from '$lib/utils/entityUtils.js';
	import {
		maxPullsToday,
		numPullsToday,
		updatePullRewardHistoryOnDateChange,
		updatePullRewardHistoryOnPullChange,
		updateNumPullsToday
	} from '$lib/utils/pullUtils.js';
	import {
		DUP_SHARD_AMT,
		MAXED_DUP_SHARD_AMT,
		MAX_DUP_COUNT
	} from '$lib/constants/gameConstants.js';
	import UserCurrency from '$lib/components/UserCurrency.svelte';
	import LogoutButton from '$lib/components/Auth/LogoutButton.svelte';
	import { onMount } from 'svelte';
	import { signedInUser } from '$lib/stores/authStore.js';
	import { resetTestUserToInitialState } from '$lib/services/testService.js';

	let result;
	let shards = 0;
	// let dupCount = 0;

	// when component mounts, check if user has pulled today
	onMount(() => {
		console.log('Game onMount() called');
		updatePullRewardHistoryOnDateChange($signedInUser);
	});

	// check if there is already a result for today
	const pullResultToday = async () => {
		const data = await fetchedPullResultToday($signedInUser.docId);
		if (!data) return false;
		// const { pullResult } = JSON.parse(data);
		result = data;
		console.log('Gsme pullResultToday:', result);
		return true; // test
	};

	// TODO: move to service
	const saveResult = async (result) => {
		// neeeds duplicates,
		const pullResultData = {
			entityData: result,
			date: new Date().toLocaleDateString()
		};
		addToPullResultHistory($signedInUser.docId, pullResultData);
		// addToOwnedEntities(); // TODO
		const newOwnedEntity = {
			entityDocId: result.docId,
			currentExp: 0,
			currentLevel: 0,
			dateAquired: new Date().toLocaleDateString(),
			duplicates: 0
		};

		// save data to user data
		await updateShardsAndDups($signedInUser.docId, result);
		// dupCount = entityData.duplicates; // TODO - specify if a pulled entity is already maxed out
		updateNumPullsToday($signedInUser);
		updatePullRewardHistoryOnPullChange($signedInUser);
	};

	const handlePull = async () => {
		const res = await fetchRandomFeaturedEntity();
		result = res;
		console.log(res);
		await saveResult(res);
	};

	const handleReset = () => {
		result = null;
		resetTestUserToInitialState($signedInUser);
		location.reload();
	};

	// exclude pullResultToday() from reactive statement {#if} to prevent triggering infinite re-renders
	const hasPulledToday = pullResultToday();
	const dupCount = result ? result.duplicates : 0;
</script>

<div class="container">
	<h1>home main</h1>

	<LogoutButton />

	<UserCurrency />

	<button on:click={handleReset}>reset</button>

	{#if numPullsToday($signedInUser) === maxPullsToday($signedInUser) || result}
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
		<div>
			<pre>{result}</pre>
		</div>
	{:else}
		<button on:click={handlePull}>pull</button>
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
