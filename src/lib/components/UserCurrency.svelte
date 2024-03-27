<script>
	import { onMount } from 'svelte';
	import { signedInUser } from '$lib/stores/authStore.js';

	// onMount(() => {
	// 	currency = getUserCurrency($signedInUser);
	// });

	const getUserCurrency = () => {
		// const userData = JSON.parse(localStorage.getItem('userData'));
		if (!$signedInUser.currencies) return 0;
		return !$signedInUser.currencies.shards;
	};
</script>

<div>
	<p>Shards: {getUserCurrency()}</p>
</div>
