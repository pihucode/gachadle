<script>
	import { onMount } from 'svelte';

	let currency = {};

	onMount(() => {
		currency = getUserCurrency();
	});

	const getUserCurrency = () => {
		const userData = JSON.parse(localStorage.getItem('userData'));
		if (!userData) return;
		return userData.currencies || {};
	};
</script>

<div>
	<p>Shards: {currency.shards}</p>
</div>
