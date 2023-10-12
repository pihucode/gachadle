import { db } from '$lib/db/firebase.js';
import {
    doc,
    getDoc,
    getDocs,
    collection,
} from 'firebase/firestore';

const fetchTagsFromDB = async () => {
    const tagsRef = collection(db, 'tags');
    const tagsSnapshot = await getDocs(tagsRef);
    const tagsList = tagsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return tagsList;
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

export { fetchTagsFromDB, tagNameFromId }