import { initializeApp } from "firebase/app";
// import {getStorage, ref} from 'firebase/storage';
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';

import {
    getFirestore,
    query,
    getDocs,
    collection,
    addDoc,
    doc,
    updateDoc,
    where,
    getDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { errorNotification, successNotification } from "../common/notification";

// var admin = require('firebase-admin');

// var serviceAccount = require('./servicekey.json');

const firebaseConfig = {
    apiKey: "AIzaSyDdLYxSw2LSzUJjBR8heFR_hrRgIa9-BcE",
    authDomain: "authapp-74df5.firebaseapp.com",
    projectId: "authapp-74df5",
    storageBucket: "authapp-74df5.appspot.com",
    // credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://authapp-74df5-default-rtdb.europe-west1.firebasedatabase.app",
    messagingSenderId: "699012364284",
    appId: "1:699012364284:web:43bc488072d85a2414a479"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// export const database = getStorage(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                avatar: user.photoURL
            });
        }
        successNotification('Login successfully');
        const result = docs.docs.map((data) => data.data())[0];
        return result;
    } catch (err) {
        errorNotification('error');
        console.error(err);
        // show toaster
        return err;
    }
};

export const saveComment = async ({ postId, comment, userId }) => {
    try {
        const docResult = await addDoc(collection(db, "comments"), {
            userId: userId,
            postId: postId,
            comment: comment
        });
        successNotification('Comment Saved');
        return docResult;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const getComments = async (value) => {
    const q = query(collection(db, "comments"), where("postId", "==", value));
    const querySnapshot = await getDocs(q);
    const que = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return que;
}

export const updateComment = async (value, id) => {
    const docRef = doc(db, "comments", id);
    await updateDoc(docRef, value);
    return docRef;
};

export const addReplyComment = async (value) => {
    const docRef = doc(db, 'comments', value.id);
    await updateDoc(docRef, value);
    return docRef;
}

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

// export const saveComment = async ({ Idpost, comment, userId }) => {
//     console.log('doc', Idpost, comment, userId);
//     try {
//         const docRef = doc(db, "files", Idpost);
//         const docResult = await updateDoc(docRef, {
//            comments: [{ comment: comment, userId: userId, postId: Idpost }], 
//         });
//         successNotification('Comment Saved');
//         return docResult;
//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// }

export const getDetails = async (value) => {
    const q = query(collection(db, "users"), where("uid", "==", value));
    const querySnapshot = await getDocs(q);
    const que = querySnapshot.docs.map(doc => ({
        ...doc.data()
    }))
    return que[0];
}

export const updateUser = async (value) => {
    const docRef = await getDocs(query(collection(db, "users"),
        where("uid", "==", value.uid)));
    try {
        const docGet = doc(db, 'users', docRef.docs[0].id);
        await updateDoc(docGet, value);
        successNotification('Updated Details');
        const result = (await getDoc(docGet)).data();
        return result;
    } catch (error) {
        errorNotification(error);
        console.error(error);
        return error;
    }
}

export const getPost = async (postId) => {
    const ref = doc(db, `files/${postId}`);
    const querySnapshot = await getDoc(ref);
    console.log('dsafa', querySnapshot.data());
    return querySnapshot.data();
}

// export const saveComment = async ({ comments, postId }) => {
//     try {
//         const docRef = doc(db, "files", postId);
//         await updateDoc(docRef, {
//            comments: comments,
//         });
//         successNotification('Comment Saved');
//         return docRef;
//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// }

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