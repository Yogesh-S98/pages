import { initializeApp } from "firebase/app";
// import {getStorage, ref} from 'firebase/storage';
import {createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';

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
    deleteDoc,
    orderBy,
    onSnapshot,
    serverTimestamp,
    setDoc,
    limit,
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

// export const signUpwithForm = async ({ email, password }) => {
//    const res = await createUserWithEmailAndPassword(auth, email, password);
//    console.log('dsfasf', res);
//    return res;
// }

const user = JSON.parse(localStorage.getItem('user'));

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (!docs.empty) {
            // If the user exists, return their details
            const userData = docs.docs[0].data();
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } else {
            // If the user doesn't exist, add them to Firestore
            const result = await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                avatar: user.photoURL,
            });
            successNotification('Loing Successfully');
            const userd = {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                avatar: user.photoURL,
                id: result.id,
            }
            localStorage.setItem('user', JSON.stringify(userd));
            return userd;
        }
    } catch (error) {
        console.log(error);
        errorNotification('Error login');
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
    const que = await querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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

export const savePosts = async (file) => {
    try {
        let uploadFile = '';
        let downloadURL = '';
        let result = '';
        if (file.file) {
            uploadFile = ref(storage, `/images/${file.user.uid}/${file.name}`);
            result = await uploadBytes(uploadFile, file.file);
            downloadURL = await getDownloadURL(uploadFile);
            await addDoc(collection(db, "files"), {
                userId: file.user.uid,
                user: file.user,
                name: file.name,
                likes: 'under',
                file: downloadURL,
                video: file.video,
                message: file.note,
                filter: file.filter,
                createdAt: serverTimestamp()
            });
        } else {
            result = await addDoc(collection(db, "files"), {
                userId: file.user.uid,
                user: file.user,
                name: '',
                likes: 'under',
                file: '',
                video: '',
                message: file.note,
                filter: '',
                createdAt: serverTimestamp()
            });
        }
        successNotification('Post Uploaded');
        return result;
    } catch (error) {
        errorNotification(error);
        console.error(error);
        return error;
    }
}

export const removePost = async (item) => {
    try {
        const result = await deleteDoc(doc(db, 'files', item.postId));
        successNotification('Successfully deleted Post');
        return result;
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
    const payload = value.user;
    if (value.file) {
        const updatepic = ref(storage, `/profiles/${value.userId}/${value.profile.file.name}`);
        await uploadBytes(updatepic, value.profile.file);
        const downloadURL = await getDownloadURL(updatepic);
        payload.avatar = downloadURL;
    }
    if (value.profile.name) {
        payload.name = value.profile.name;
    }
    const docRef = await getDocs(query(collection(db, "users"),
        where("uid", "==", value.userId)));
    try {
        const docGet = doc(db, 'users', docRef.docs[0].id);
        await updateDoc(docGet, payload);
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
    // const q = query(collectionRef);
    const collectionRef = collection(db, "files");
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    // console.log('adfa', querySnapshot);
    return await querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    // onSnapshot(q, (snapshot) => {
    //     const data = snapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data()
    //     }));
    //     console.log('ddddd', data);
    // });
    // return '';
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

export const getUsersList = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    const filtered = snapshot.docs
        .map(doc => doc.data())
        .filter(user => user.uid !== auth.currentUser.uid);
    return filtered;
}

export const getOrCreateConversation = async (userA, userB) => {
    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("users", "in", [
        [userA, userB],
        [userB, userA]
      ])
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
  
    // Create new conversation
    const newConversation = await addDoc(conversationsRef, {
      users: [userA, userB],
      updatedAt: serverTimestamp()
    });
    return newConversation.id;
};

export const sendUserMessage = async (conversationId, fromUserId, text) => {
    try {
        const messagesRef = collection(db, "conversations", conversationId, "messages");
        await addDoc(messagesRef, {
          from: fromUserId,
          text,
          createdAt: serverTimestamp()
        });
      
        // Update conversation timestamp
        await setDoc(
          doc(db, "conversations", conversationId),
          {
            updatedAt: serverTimestamp(),
            lastMessage: text
          },
          { merge: true }
        );
        return 'success';
    }  catch (error) {
        errorNotification(error);
        console.error(error);
        return error;
    }
}

export const deleteUserMessage = async (conversationId, messageId) => {
    try {
      const messageRef = doc(db, "conversations", conversationId, "messages", messageId);
      await deleteDoc(messageRef);
    //   successNotification("Message deleted.");
      return "success";
    } catch (error) {
    //   console.error("Error deleting message:", error);
    //   errorNotification(error.message || "Failed to delete message.");
      return error;
    }
};

export const getUserMessages = async (conversationId) => {
    try {
      const ref = collection(db, "conversations", conversationId, "messages");
      const q = query(
        ref,
        orderBy("createdAt", "asc")
    );
  
      const querySnapshot = await getDocs(q);
  
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,         // always good to have document ID!
        ...doc.data()
      }));
  
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      errorNotification(error.message || "Something went wrong while fetching messages.");
      throw error; // Also rethrow if caller needs to catch
    }
};

export const getConversationSummary = async (conversationId) => {
    try {
        const ref = collection(db, "conversations", conversationId, "messages");
        const q = query(ref, orderBy("createdAt", "desc"), limit(1));  // latest message only
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching latest message: ", error);
        return null;
    }
};

export function listenToMessages(conversationId, callback) {
    if (!conversationId) return;

    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const newMessage = { id: change.doc.id, ...change.doc.data() };
                callback(newMessage);
            }
        });
    });

    return unsubscribe; // If you want to stop listening later
}
  
provider.setCustomParameters({
    prompt: 'select_account'
});
export default app;