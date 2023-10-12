import { db } from '$lib/db/firebase.js';
import {
    addDoc,
    getDocs,
    collection,
} from 'firebase/firestore';

const fetchDataFromDB = async () => {
    const submissionsRef = collection(db, 'submissions-dev');
    const submissionsSnapshot = await getDocs(submissionsRef);
    const data = submissionsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
};

const saveSubmissionToDB = async (
    entityName,
    entityImgRef,
    creatorName,
    creatorLink,
    tags
) => {
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

export { saveSubmissionToDB, fetchDataFromDB };