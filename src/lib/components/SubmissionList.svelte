<script>
	import { onMount } from 'svelte';
	import { db, storage } from '$lib/db/firebase.js';
	import {
		doc,
		addDoc,
		getDoc,
		getDocs,
		updateDoc,
		collection,
		collectionGroup
	} from 'firebase/firestore';
	import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

	let submissions = [];
	onMount(() => {
		fetchDataFromDB();
	});

	const getImageUrl = async (imgPath) => {
		const storageRef = ref(storage, imgPath);
		const url = await getDownloadURL(storageRef);
		return url;
	};

	const fetchDataFromDB = async () => {
		const submissionsRef = collection(db, 'submissions-dev');
		const submissionsSnapshot = await getDocs(submissionsRef);
		const data = submissionsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
		submissions = data;
		// console.log(submissions);
	};

	const tagNameFromId = async (tagId) => {
		const docRef = doc(db, 'tags', tagId);
		const docSnapshot = await getDoc(docRef);

		if (docSnapshot.exists()) {
			return docSnapshot.data().name;
		} else {
			return 'UNDEFINED TAG';
		}
	};

	const toggleIsActive = async (id, value) => {
		const docRef = doc(db, 'submissions-dev', id);
		await updateDoc(docRef, {
			isActive: value
		});
		fetchDataFromDB();
	};
	const handleApprove = async (id, value) => {
		const docRef = doc(db, 'submissions-dev', id);
		await updateDoc(docRef, {
			isApproved: value
		});
		fetchDataFromDB();
	};
</script>

<div>
	<table class="mainTable">
		<thead>
			<tr>
				<th>Creator</th>
				<th>Entity</th>
				<th>Tags</th>
				<th>isActive</th>
				<th>isApproved</th>
			</tr>
		</thead>
		<tbody>
			{#each submissions as s}
				<tr>
					<td><a href={s.creatorLink}>{s.creatorName}</a> </td>
					<td>
						<div class="col">
							{#await getImageUrl(s.entityImgRef)}
								<span>loading...</span>
							{:then url}
								<img src={url} class="entityImg" alt={s.entityName} />
							{:catch error}
								<span>error: {error.message}</span>
							{/await}
							{s.entityName}
						</div>
					</td>
					<td>
						<div>
							{#each s.tags as tagId}
								{#await tagNameFromId(tagId)}
									<span>loading...</span>
								{:then tagName}
									<span>{tagName}, </span>
								{:catch error}
									<span>error: {error.message}</span>
								{/await}
							{/each}
						</div>
					</td>
					<td>
						<div class="col">
							{s.isActive ? 'true' : 'false'}
							<button class="btn" on:click={toggleIsActive(s.id, !s.isActive)}
								>{s.isActive ? 'Deactivate' : 'Activate'}</button
							>
						</div>
					</td>
					<td>
						<div class="col">
							{s.isApproved ? 'true' : 'false'}
							{#if !s.isApproved}
								<button class="btn" on:click={handleApprove(s.id, true)}>Approve</button>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	th,
	td {
		padding: 6px 8px;
	}
	tr {
		border-bottom: 2px solid #000000;
	}

	.entityImg {
		max-width: 100px;
		max-height: 100px;
		overflow: hidden;
	}

	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
