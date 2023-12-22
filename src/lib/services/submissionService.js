import { db } from '$lib/db/firebase.js';
import { doc, getDoc, getDocs, addDoc, collection, query, where } from 'firebase/firestore';

const fetchDataFromDB = async () => {
	const submissionsRef = collection(db, 'submissions-dev');
	const submissionsSnapshot = await getDocs(submissionsRef);
	const data = submissionsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	return data;
};

const fetchSubmissionById = async (id) => {
	const docRef = doc(db, 'submissions-dev', id);
	const docSnapshot = await getDoc(docRef);
	if (docSnapshot.exists()) {
		return docSnapshot.data();
	} else {
		return null;
	}
};

// choose a random submission from the DB where isActive is true and its tags include at least one of the given tags
const fetchRandomValidEntity = async (tagIds) => {
	const q = query(
		collection(db, 'submissions-dev'),
		// where('isActive', '==', true),
		where('tags', 'array-contains-any', tagIds)
	);
	const querySnapshot = await getDocs(q);
	const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	const random = data[Math.floor(Math.random() * data.length)];
	return random;
};

const saveSubmissionToDB = async (entityName, entityImgRef, creatorName, creatorLink, tags) => {
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

export { fetchDataFromDB, fetchSubmissionById, fetchRandomValidEntity, saveSubmissionToDB };
