<script>
	import { isEnvDev, isSignedIn } from '$lib/stores/generalStore.js';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	$: if (browser && $isEnvDev && $page.url.pathname !== '/') {
		// redirect to homepg
		console.log(1);
		goto('/');
	} else if (browser && $isEnvDev && $page.url.pathname === '/') {
		console.log(11); // do nothing
	} else if (browser && !$isSignedIn && $page.url.pathname !== '/login') {
		// console.log('we are running in the browser, not signed in, and not on the sign in page, we are going to the sign in page');
		console.log(2);
		goto('/login');
	} else if (browser && $isSignedIn && $page.url.pathname === '/login') {
		// console.log('we are running in the browser, signed in, and on the sign in page, we are going to the game page');
		console.log(3);
		goto('/game');
	}
</script>

<slot />
