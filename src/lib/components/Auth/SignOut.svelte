<script>
	import { getAuth, signOut } from 'firebase/auth';

	const auth = getAuth();
	signOut(auth)
		.then(() => {
			console.log('signed out');
			// Sign-out successful.
		})
		.catch((error) => {
			console.error(error);
			// An error happened.
		});
</script>

<button on:click={signOut}>Log Out</button>
