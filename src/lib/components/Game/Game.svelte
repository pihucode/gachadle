<script>
	import { fetchedPullResultToday, fetchRandomFeaturedEntity } from '$lib/services/gachaService.js';
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
		if (data) {
			const { pullResult } = JSON.parse(data);
			result = pullResult;
			return true; // test
		}
		return false;
	};

	// TODO: move to service
	const saveResultToLocalStorage = (result) => {
		// const pullResultData = {
		// 	pullResult: result,
		// 	date: new Date().toLocaleDateString()
		// };
		// localStorage.setItem('pullResultToday', JSON.stringify(pullResultData)); // TODO - no longer needed ?
		// save data to pull history
		// let arr = JSON.parse(localStorage.getItem('pullHistory')) || [];
		// arr.push(pullResultData);
		// localStorage.setItem('pullHistory', JSON.stringify(arr));

		const pullResultData = {
			entityDocId: result.docId,
			date: new Date().toLocaleDateString()
		};
		addToPullResultHistory(pullResultData);

		// save data to user data
		updateShardsAndDups($signedInUser.docId, result);
		// let userData = JSON.parse(localStorage.getItem('userData')) || {};
		// let ownedEntities = userData.ownedEntities || [];
		// let entityData = ownedEntities.find((c) => c.id === result.id);
		// if (entityData) {
		// 	// user already owns entity
		// 	if (entityData.duplicates === MAX_DUP_COUNT) {
		// 		shards = MAXED_DUP_SHARD_AMT;
		// 	} else {
		// 		entityData.duplicates++;
		// 		shards = DUP_SHARD_AMT;
		// 	}
		// 	// update entity data
		// 	ownedEntities = ownedEntities.map((e) => (e.id === result.id ? entityData : e));
		// } else {
		// 	// user doesn't own entity
		// 	entityData = {
		// 		id: result.id,
		// 		duplicates: 0,
		// 		currentExp: 0,
		// 		currentLevel: 0,
		// 		dateAcquired: new Date().toLocaleDateString()
		// 	};
		// 	ownedEntities.push(entityData);
		// }
		// userData.ownedEntities = ownedEntities;
		// if (!userData.currencies) userData.currencies = { shards: 0 };
		// userData.currencies.shards += shards;
		// localStorage.setItem('userData', JSON.stringify(userData));

		// dupCount = entityData.duplicates; // TODO - specify if a pulled entity is already maxed out
		// other updates
		updateNumPullsToday($signedInUser);
		updatePullRewardHistoryOnPullChange($signedInUser);
	};

	const handlePull = async () => {
		const res = await fetchRandomFeaturedEntity();
		result = res;
		console.log(res);
		saveResultToLocalStorage(res);
	};

	const handleReset = () => {
		result = null;
		// localStorage.removeItem('pullResultToday');
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
