import { db } from '$lib/db/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

export const resetTestUserToInitialState = async (user) => {
    const userRef = doc(db, 'users-dev', user.docId);
    const { uid, email, username, dateCreated } = user;
    const initialUserObj = {
        uid,
        email,
        username,
        dateCreated
    };
    await setDoc(userRef, initialUserObj);
};