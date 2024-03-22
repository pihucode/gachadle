<script>
	import Modal from '$lib/components/Entity/Modal.svelte';
	import { getImageUrl } from '$lib/services/fileService.js';
	import { getRarityName, getRarityStar, getRarityProgress } from '$lib/utils/entityUtils.js';

	export let data; //json submission object
	export let entity; //entity object
	export let showModal = false;
	export let closeModal;
</script>

<Modal bind:showModal {closeModal}>
	<div class="modal">
		<div>
			{#await getImageUrl(data.entityImgRef)}
				<span>loading...</span>
			{:then url}
				<img src={url} class="entityImg" alt={data.entityName} />
			{:catch error}
				<span>error: {error.message}</span>
			{/await}
		</div>
		<div>
			<h2>{data.entityName}</h2>
			<p>{getRarityStar(entity.duplicates)} star ({getRarityName(entity.duplicates)})</p>
			<p>Description here</p>
			<p>Designed by <a href="/">{data.creatorName}</a></p>
			<pre>

				{JSON.stringify(data, null, 2)}
			</pre>
		</div>
	</div>
</Modal>

<style>
	.modal {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.entityImg {
		width: 300px;
		height: 300px;
		object-fit: cover;
		overflow: hidden;
	}
</style>
