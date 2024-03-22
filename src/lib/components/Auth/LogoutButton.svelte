<script>
	import { getAuth, signOut } from 'firebase/auth';
	import { isSignedIn, signedInUser } from '$lib/stores/authStore.js';

	const logout = () => {
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				// Sign-out successful.
				console.log('signed out');
				$isSignedIn = false;
				$signedInUser = null;
			})
			.catch((error) => {
				// An error happened.
				console.error(error);
			});
	};
</script>

<button on:click={logout}>Log Out</button>
