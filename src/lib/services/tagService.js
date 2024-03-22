import { db } from '$lib/db/firebase.js';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

const fetchTagsFromDB = async () => {
    const tagsRef = collection(db, 'tags');
    // get all tags whose docID is not metadata
    const tagsSnapshot = await getDocs(tagsRef);
    const tagsList = tagsSnapshot.docs
        .filter((doc) => doc.id !== 'metadata')
        .map((doc) => ({ ...doc.data(), id: doc.id }));
    return tagsList;
};

const getRandomTags = async (numTags) => {
    const allTags = await fetchTagsFromDB();
    const randomTags = [];
    // no duplicate random tags
    while (randomTags.length < numTags) {
        const randomIndex = Math.floor(Math.random() * allTags.length);
        const randomTag = allTags[randomIndex];
        if (!randomTags.includes(randomTag)) randomTags.push(randomTag);
    }
    return randomTags;
};

const getTagsToday = async (numTags) => {
    // check if tags have already been generated today
    const tagsToday = JSON.parse(localStorage.getItem('tagsToday'));
    if (tagsToday && tagsToday.date === new Date().toLocaleDateString())
        return JSON.parse(tagsToday.tags);
    // save tags to local storage of browser
    const tags = await getRandomTags(numTags);
    const data = {
        date: new Date().toLocaleDateString(),
        tags: JSON.stringify(tags)
    };
    localStorage.setItem('tagsToday', JSON.stringify(data));
    return tags;
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

export { getTagsToday, fetchTagsFromDB, tagNameFromId };
