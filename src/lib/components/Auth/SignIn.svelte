<!-- SignIn.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { createUserWithEmail, signInWithEmail } from '$lib/services/authService.js';
	import { isSignedIn, signedInUser } from '$lib/stores/authStore.js';
	let email = 'test1@mail.com';
	let password = 'testpw123';
	let showLogin = true;

	const handleSignInWithEmail = async (email, password) => {
		let user = await signInWithEmail(email, password);
		if (user) {
			$isSignedIn = true;
			$signedInUser = user;
			goto('/game');
		} else {
			console.log('sign in failed');
		}
	};

	const handleCreateUserWithEmail = (email, password) => {
		createUserWithEmail(email, password);
		if (user) {
			$isSignedIn = true;
			$signedInUser = user;
			goto('/game');
		} else {
			console.log('account creation failed');
		}
	};
</script>

<div>
	{#if showLogin}
		<form on:submit|preventDefault={() => handleSignInWithEmail(email, password)}>
			<label for="email-input">Email:</label>
			<input type="email" bind:value={email} required />

			<label for="password-input">Password:</label>
			<input type="password" bind:value={password} required />

			<button type="submit">Sign In</button>
		</form>
		<button on:click={() => (showLogin = false)}>Create Account</button>
	{:else}
		<form on:submit|preventDefault={() => handleCreateUserWithEmail(email, password)}>
			<label for="email-input">Email:</label>
			<input type="email" bind:value={email} required />

			<label for="password-input">Password:</label>
			<input type="password" bind:value={password} required />

			<button type="submit">Create User</button>
		</form>
		<button on:click={() => (showLogin = true)}>Sign In</button>
	{/if}

	<!-- <button on:click={signInWithGoogle}>Sign In with Google</button> -->
</div>
