import { initializeApp } from "firebase/app";
// import {getStorage, ref} from 'firebase/storage';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';

import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    documentId,
    onSnapshot,
    doc,
    updateDoc,
} from "firebase/firestore";
import { v4 } from 'uuid';
import { getDownloadURL, getStorage, listAll, ref, updateMetadata, uploadBytes } from 'firebase/storage';
import { errorNotification, successNotification } from "../common/notification";

var admin = require('firebase-admin');

var serviceAccount = require('./servicekey.json');

const firebaseConfig = {
    apiKey: "AIzaSyDdLYxSw2LSzUJjBR8heFR_hrRgIa9-BcE",
    authDomain: "authapp-74df5.firebaseapp.com",
    projectId: "authapp-74df5",
    storageBucket: "authapp-74df5.appspot.com",
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://authapp-74df5-default-rtdb.europe-west1.firebasedatabase.app",
    messagingSenderId: "699012364284",
    appId: "1:699012364284:web:43bc488072d85a2414a479"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// export const database = getStorage(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const storageRef = ref(storage);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        successNotification('Login successfully');
        // const q = query(collection(db, "users"), where("uid", "==", user.uid));
        // const docs = await getDocs(q);
        // if (docs.docs.length === 0) {
        //     await addDoc(collection(db, "users"), {
        //         uid: user.uid,
        //         name: user.displayName,
        //         authProvider: "google",
        //         email: user.email,
        //         avatar: user.photoURL
        //     });
        // }
        // if (user) {
        //     notify;
        // }
        return user;
    } catch (err) {
        errorNotification('error');
        console.error(err);
        // show toaster
        return err;
    }
};
const user = JSON.parse(localStorage.getItem('user'));
export const savePosts = async ({ name, file }) => {
    try {
        const uploadFile = ref(storage, `/images/${user.uid}/${file.name}`);
        const docResult = await uploadBytes(uploadFile, file);
        const downloadURL = await getDownloadURL(uploadFile);
        await addDoc(collection(db, "files"), {
            userId: user.uid,
            user: user,
            name: file.name,
            likes: 'under',
            file: downloadURL,
            message: '',
        });
        successNotification('Post Uploaded');
        return docResult;
    } catch (error) {
        errorNotification(error);
        console.error(error);
        return error;
    }
}

export const saveLike = async ({ postId, like, userId }) => {
    try {
        const docRef = doc(db, "files", postId);
        const docResult = await updateDoc(docRef, {
            likes: [{ like: like, userId: userId, postId: postId }],
        })
        return docResult;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export const addLikes = async ({ likes, postId }) => {
    try {
        const docRef = doc(db, "files", postId);
        const docResult = await updateDoc(docRef, {
            likes: likes,
        })
        return docResult;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export const getSavePosts = async () => {
    // const userId = user.uid;
    const q = query(collection(db, "files"));
    // const q = query(collection(db, "files"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

// export const getSaved = async ({ name }) => {
//     try {
//         const docResult = await addDoc(collection(db, "posts"), {
//             userId: user.uid,
//             name: name,
//         });
//         return docResult;
//     } catch (error) {
//         console.error(error);
//         return error;
//     }
// }

// export const getPosts = async () => {
//     const userId = user.uid;
//     const q = query(collection(db, "posts"), where("userId", "==", userId));
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
// }

provider.setCustomParameters({
    prompt: 'select_account'
});
export default app;