<script>
	import { db, storage } from '$lib/db/firebase.js';
	import { collection, addDoc } from 'firebase/firestore';
	import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

	let submissionItem = {};

	const isUrlValid = (url) => {
		try {
			new URL(url);
			return true;
		} catch (err) {
			return false;
		}
	};

	const uploadFile = (file) => {
		const metadata = {};

		// Upload file and metadata to the object 'images/mountains.jpg'
		const storageRef = ref(storage, `entities-dev/${submissionItem.creatorName}/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file, metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused');
						break;
					case 'running':
						console.log('Upload is running');
						break;
				}
			},
			(error) => {
				switch (error.code) {
					case 'storage/unauthorized':
						console.error("User doesn't have permission to access the object");
						break;
					case 'storage/canceled':
						console.error('User canceled the upload');
						break;
					case 'storage/unknown':
						console.error('Unknown error occurred, inspect error.serverResponse');
						break;
				}
			},
			() => {
				// Upload completed successfully, now we can get the download URL
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log('File available at', downloadURL);
				});
			}
		);
	};

	const handleSubmitDB = async () => {
		const submission = {
			entityName: submissionItem.entityName,
			entityImgRef: 'test',
			creatorLink: 'test',
			creatorName: submissionItem.creatorName,
			tags: ['71NjWeq7uXfMqA0zAZvC', 'DaRKwIQFqrLLAtTtUYBx', 'jlDwLZ2OPAzi2n4Cjjm7'],
			isApproved: false,
			isActive: false,
			timestampSubmitted: new Date(),
			timestampApproved: null
		};
		const docRef = await addDoc(collection(db, 'submissions-dev'), submission);
		console.log('Document written with ID: ', docRef.id);
	};

	const handleSubmitUI = () => {
		console.log('submitting UI');
		console.log(submissionItem);
		uploadFile(submissionItem.entityImg[0]);
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

		<button class="btn-submit" on:click={handleSubmitUI}>Submit</button>
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
