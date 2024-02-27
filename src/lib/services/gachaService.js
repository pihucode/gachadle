import { db } from '$lib/db/firebase.js';
import { doc, getDoc, getDocs, addDoc, collection, query, where } from 'firebase/firestore';

//choose a random featured entity from the DB
const fetchRandomFeaturedEntity = async () => {
	const submissionsRef = collection(db, 'submissions-dev');
	const submissionsSnapshot = await getDocs(submissionsRef);
	const data = submissionsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	const random = data[Math.floor(Math.random() * data.length)];
	return random;
};

export { fetchRandomFeaturedEntity };
