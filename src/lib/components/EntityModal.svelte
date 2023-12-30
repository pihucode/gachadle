<script>
	import Modal from './Modal.svelte';

	export let data;
	export let showModal = false;
	export let closeModal;
</script>

<Modal bind:showModal {closeModal}>
	<h2 slot="title">modal title</h2>
	<p>{data}</p>
</Modal>
