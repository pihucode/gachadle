<script>
	import { onMount } from 'svelte';
	import { getImageUrl } from '$lib/services/fileService.js';
	import { fetchSubmissionById } from '$lib/services/submissionService.js';
	import { getRarityName, getRarityStar, getRarityProgress } from '$lib/utils/entityUtils.js';
	import EntityModal from '$lib/components/Entity/EntityModal.svelte';
	import { signedInUser } from '$lib/stores/authStore.js';

	let entities = [];
	let openedModalId = null;

	onMount(() => {
		console.log('EntityList onMount() called');
		getAllEntities();
	});

	const getAllEntities = () => {
		// get all entities belonging to the user
		// const userData = JSON.parse(localStorage.getItem('userData'));
		// if (!userData) return;
		// const entityData = userData.ownedEntities || [];
		entities = $signedInUser.ownedEntities || [];
	};

	const closeModal = () => {
		openedModalId = null;
	};
</script>

<div>
	<h1>entity list</h1>
	<!-- TODO: Refactor into an unordered list -->
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
					<p>{e.duplicates + 1} copies total</p>
					<p>{getRarityStar(e.duplicates)} star ({getRarityName(e.duplicates)})</p>
					<p>{getRarityProgress(e.duplicates)}/{getRarityStar(e.duplicates) + 1} to next rank up</p>
					<p>level {e.currentLevel}</p>

					<EntityModal
						showModal={openedModalId === e.id}
						{closeModal}
						data={submission}
						entity={e}
					/>
					<button on:click={() => (openedModalId = e.id)}> details </button>
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
		width: 150px;
		height: 150px;
		object-fit: cover;
		overflow: hidden;
	}
</style>
