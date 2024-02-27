<script>
	import { onMount } from 'svelte';
	import { fetchTagsFromDB } from '$lib/services/tagService.js';
	import { uploadFile } from '$lib/services/fileService.js';
	import { saveSubmissionToDB } from '$lib/services/submissionService.js';

	let submissionItem = {};
	const existingCreatorNames = ['user1', 'user2'];
	let tags = [];

	onMount(async () => {
		tags = await fetchTagsFromDB();
	});

	const handleTagSelectOnChange = (e) => {
		const MAX_TAG_SELECTIONS = 2;
		const selectedOptions = Array.from(e.target.selectedOptions);

		if (selectedOptions.length > MAX_TAG_SELECTIONS) {
			selectedOptions.pop().selected = false;
		}
	};

	const isUrlValid = (url) => {
		try {
			new URL(url);
			return true;
		} catch (err) {
			return false;
		}
	};

	const isCreatorNameValid = (name) => {
		name = name.replace(/\s/g, '').toLowerCase(); // remove whitespace and make lowercase
		return name.length > 0 && !existingCreatorNames.includes(name);
	};

	const handleSubmitFormToDB = async () => {
		// TODO: check for validity of fields
		// if (!isUrlValid(submissionItem.creatorLink)) {
		// 	console.log('invalid creator link');
		// 	return;
		// }
		if (!isCreatorNameValid(submissionItem.creatorLink)) {
			console.log('invalid creator name');
			return;
		}
		// upload img to Firebase Storage
		const downloadURL = await uploadFile(submissionItem.entityImg[0], submissionItem.creatorName);
		saveSubmissionToDB(
			submissionItem.entityName,
			downloadURL,
			submissionItem.creatorName,
			submissionItem.creatorLink,
			submissionItem.tags
		);
		// console.log(submissionItem);
	};
</script>

<div class="submit">
	<h1>Submit an Entity</h1>
	<form class="form">
		<label
			>Entity Name
			<input type="text" name="entityName" bind:value={submissionItem.entityName} />
		</label>

		<label
			>Entity Image
			<input type="file" name="entityImg" accept="image/*" bind:files={submissionItem.entityImg} />
		</label>

		<label>
			Creator Name
			<input type="text" name="creatorName" bind:value={submissionItem.creatorName} />
		</label>

		<label
			>Creator Link
			<input type="text" name="creatorLink" bind:value={submissionItem.creatorLink} />
		</label>
		<label>
			Tags
			<select multiple bind:value={submissionItem.tags} on:change={handleTagSelectOnChange}>
				{#each tags as tag}
					<option value={tag.id}>{tag.id} - {tag.name}</option>
				{/each}
			</select>
		</label>

		<button class="btn-submit" on:click={handleSubmitFormToDB}>Submit</button>
	</form>
</div>

<style>
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	label {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 4px;
	}
</style>
