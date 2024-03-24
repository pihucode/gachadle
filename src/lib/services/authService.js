import { db, firebaseAuth } from '$lib/db/firebase.js';
import { doc, getDoc, getDocs, addDoc, collection, query, where } from 'firebase/firestore';
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";

// todo
const signInWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log('Signed in:', user);
            return user;
            // check if user already exists in Firestore
            // if not, create a new user in Firestore
        }).catch((error) => {
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error('Error signing in with Google:', error);
        });
};

export const createUserWithEmail = async (email, password) => {
    console.log(email, password);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            // Store additional user data in Firestore
            let createdUser = await createUserInDb(user.uid, email);
            console.log('New user created:', createdUser);
            return createdUser;
        })
        .catch((error) => {
            console.error('Error creating user:', error);
        });
};

export const signInWithEmail = async (email, password) => {
    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const signedInUser = await getUserByUid(user.uid);
        console.log('Signed in:', signedInUser);
        return signedInUser;
    } catch (error) {
        console.error('Error signing in through email:', error);
    }
}

const createUserInDb = async (uid, email) => {
    const username = email.split('@')[0];
    const newUser = {
        uid,
        email: email,
        username,
        dateCreated: new Date()
    }
    const docRef = await addDoc(collection(db, 'users-dev'), newUser);
    console.log('User created with ID: ', docRef.id);
};

export const getUserByUid = async (uid) => {
    const usersRef = collection(db, 'users-dev');
    const q = query(usersRef, where('uid', '==', uid));
    const userDocs = await getDocs(q);
    return userDocs.docs[0].data();
};