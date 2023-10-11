<script>
	import { onMount } from 'svelte';
	import { db, storage } from '$lib/db/firebase.js';
	import { collection, addDoc, getDocs, collectionGroup } from 'firebase/firestore';
	import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

	let submissionItem = {};
	const existingCreatorNames = ['user1', 'user2'];
	let tags = [];

	onMount(() => {
		fetchTagsFromDB();
	});

	const fetchTagsFromDB = async () => {
		const tagsRef = collection(db, 'tags');
		const tagsSnapshot = await getDocs(tagsRef);
		const tagsList = tagsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
		console.log(tagsList);
		tags = tagsList;
	};

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

	const uploadFile = async (file) => {
		const metadata = {};

		// Upload file and metadata to the object 'images/mountains.jpg'
		const storageRef = ref(storage, `entities-dev/${submissionItem.creatorName}/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file, metadata);

		return new Promise(async (resolve, reject) => {
			// Listen for state changes, errors, and completion of the upload.
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					// ... (progress and state change handling)
				},
				(error) => {
					// ... (error handling)
					reject(error); // Reject the promise on error
				},
				async () => {
					try {
						// Upload completed successfully, now we can get the download URL
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						console.log('File available at', downloadURL);
						resolve(downloadURL); // Resolve the promise with the download URL
					} catch (error) {
						reject(error); // Reject the promise if getting the download URL fails
					}
				}
			);
		});
	};

	const saveToDB = async (entityName, entityImgRef, creatorName, creatorLink, tags) => {
		const submission = {
			entityName: entityName,
			entityImgRef: entityImgRef,
			creatorName: creatorName,
			creatorLink: creatorLink,
			tags: tags,
			isApproved: false,
			isActive: false,
			timestampSubmitted: new Date(),
			timestampApproved: null
		};
		const docRef = await addDoc(collection(db, 'submissions-dev'), submission);
		console.log('Document written with ID: ', docRef.id);
	};

	const isCreatorNameValid = (name) => {
		name = name.replace(/\s/g, '').toLowerCase(); // remove whitespace and make lowercase
		return name.length > 0 && !existingCreatorNames.includes(name);
	};

	const handleSubmitFormToDB = async () => {
		console.log('submitting UI');

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
		const downloadURL = await uploadFile(submissionItem.entityImg[0]);
		saveToDB(
			submissionItem.entityName,
			downloadURL,
			submissionItem.creatorName,
			submissionItem.creatorLink,
			submissionItem.tags
		);
		console.log(submissionItem);
	};

	const handleSubmitUI = async () => {
		console.log('submitting UI');
		console.log(submissionItem);
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
