<script>
	import { onMount } from 'svelte';
	import { signedInUser } from '$lib/stores/authStore.js';

	let currency = {};

	onMount(() => {
		currency = getUserCurrency($signedInUser);
	});

	const getUserCurrency = (user) => {
		// const userData = JSON.parse(localStorage.getItem('userData'));
		if (!user) return;
		return user.currencies || {};
	};
</script>

<div>
	<p>Shards: {currency.shards}</p>
</div>
