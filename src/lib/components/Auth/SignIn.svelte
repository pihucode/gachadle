<!-- SignIn.svelte -->
<script>
	import {
		signInWithGoogle,
		createUserWithEmail,
		signInWithEmail
	} from '$lib/services/authService.js';
	let email = '';
	let password = '';
	let showLogin = true;
</script>

<div>
	{#if showLogin}
		<form on:submit|preventDefault={() => signInWithEmail(email, password)}>
			<label>Email:</label>
			<input type="email" bind:value={email} required />

			<label>Password:</label>
			<input type="password" bind:value={password} required />

			<button type="submit">Sign In</button>
		</form>
		<button on:click={() => (showLogin = false)}>Create Account</button>
	{:else}
		<form on:submit|preventDefault={() => createUserWithEmail(email, password)}>
			<label>Email:</label>
			<input type="email" bind:value={email} required />

			<label>Password:</label>
			<input type="password" bind:value={password} required />

			<button type="submit">Create User</button>
		</form>
		<button on:click={() => (showLogin = true)}>Sign In</button>
	{/if}

	<button on:click={signInWithGoogle}>Sign In with Google</button>
</div>
