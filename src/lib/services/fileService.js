/* eslint-disable no-async-promise-executor */

import { storage } from '$lib/db/firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const uploadFile = async (file, subfolder) => {
    const metadata = {};
    const storageRef = ref(storage, `entities-dev/${subfolder}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise(async (resolve, reject) => {
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // ... (progress and state change handling)
            },
            (error) => {
                // ... (error handling)
                reject(error); // Reject the promise on error
            },
            async () => {
                try {
                    // Upload completed successfully, now we can get the download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);
                    resolve(downloadURL); // Resolve the promise with the download URL
                } catch (error) {
                    reject(error); // Reject the promise if getting the download URL fails
                }
            }
        );
    });
};

const getImageUrl = async (imgPath) => {
    const storageRef = ref(storage, imgPath);
    const url = await getDownloadURL(storageRef);
    return url;
};

export { uploadFile, getImageUrl }