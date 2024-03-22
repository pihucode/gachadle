import { db } from '$lib/db/firebase.js';
import { doc, getDoc, getDocs, arrayUnion, collection, updateDoc, increment } from 'firebase/firestore';

import {
    DUP_SHARD_AMT,
    MAXED_DUP_SHARD_AMT,
    MAX_DUP_COUNT
} from '$lib/constants/gameConstants.js';


//choose a random featured entity from the DB
export const fetchRandomFeaturedEntity = async () => {
    const submissionsRef = collection(db, 'submissions-dev');
    const submissionsSnapshot = await getDocs(submissionsRef);
    const data = submissionsSnapshot.docs.map((doc) => ({ ...doc.data(), docId: doc.id }));
    const random = data[Math.floor(Math.random() * data.length)];
    return random;
};

export const updatePullRewardHistoryInDb = (docId, pullRewardHistory) => {
    const userRef = doc(db, 'users-dev', docId);
    updateDoc(userRef, { pullRewardHistory });
}

export const updateNumPullsTodayInDb = (docId, numPullsToday) => {
    const userRef = doc(db, 'users-dev', docId);
    updateDoc(userRef, { numPullsToday });
}

// check if there is already a result for today
export const fetchedPullResultToday = async (docId) => {
    const userRef = doc(db, 'users-dev', docId);
    const userSnapshot = await getDoc(userRef);
    const history = userSnapshot.data().pullResultHistory;
    if (!history) return null;
    const pullResultToday = history.find(
        (pull) => pull.date === new Date().toLocaleDateString());
    return pullResultToday;
    // return userSnapshot.data().pullResultToday;
}

export const addToPullResultHistory = (docId, pullResult) => {
    const userRef = doc(db, 'users-dev', docId);
    updateDoc(userRef, { pullResultHistory: arrayUnion(pullResult) });
};

export const updateShardsAndDups = (userDocId, pullResult) => {
    console.log('unfinished implementation of method updateShardsAndDups()');
    const userRef = doc(db, 'users-dev', userDocId);
    // updateDoc(userRef, { shards: 0, duplicates: 0 });

    // find all the entities owned by this user
    let ownedEntities = userRef.collection('ownedEntities') || [];
    let entityData = ownedEntities.find((e) => e.id === pullResult.id);
    let shards = 0;
    if (entityData) {
        // user already owns entity
        if (entityData.duplicates === MAX_DUP_COUNT) {
            shards = MAXED_DUP_SHARD_AMT;
        } else {
            entityData.duplicates++;
            shards = DUP_SHARD_AMT;
        }
        // update entity data
        ownedEntities = ownedEntities.map((e) => (e.id === pullResult.id ? entityData : e));
    } else {
        // user doesn't own entity
        entityData = {
            id: pullResult.id,
            duplicates: 0,
            currentExp: 0,
            currentLevel: 0,
            dateAcquired: new Date().toLocaleDateString()
        };
        ownedEntities.push(entityData);
    };
    // if (!userRef.currencies) userRef.currencies = { shards: 0 } // might not need this if using firestore update
    let updateObj = {
        ownedEntities,
        "currencies.shards": increment(shards),
    };
    userRef.update(updateObj);
};
