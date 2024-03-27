// import { db } from '$lib/db/firebase.js';
// import { doc, getDoc, getDocs, addDoc, collection, query, where } from 'firebase/firestore';
// import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";

// export const getUserByUid = async (uid) => {
//     const usersRef = collection(db, 'users-dev');
//     const q = query(usersRef, where('uid', '==', uid));
//     const userDocs = await getDocs(q);
//     return { ...userDocs.docs[0].data(), docId: userDocs.docs[0].id };
// };
