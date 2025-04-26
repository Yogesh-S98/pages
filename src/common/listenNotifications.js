// import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
// import { auth, db } from "../googleSignIn/config";
// import { useMessages } from "./MessageContext";

// /**
//  * Listen for real-time new messages and update the global state
//  */
// export const listenForNewMessages = (chatId) => {
//   const { setMessages } = useMessages(); // Use the global state

//   const ref = collection(db, "conversations", chatId, "messages");
//   const q = query(ref, orderBy("timestamp"));

//   return onSnapshot(q, (snapshot) => {
//     const messages = snapshot.docChanges()
//       .filter(change => change.type === "added")  // Only 'added' messages
//       .map(change => ({
//         id: change.doc.id,
//         ...change.doc.data()
//       }));

//     if (messages.length > 0) {
//       // Update the global message state
//       setMessages(prevMessages => [...prevMessages, ...messages]);

//       // Trigger notification (if new message is from someone else)
//       const lastMessage = messages[messages.length - 1];
//       if (lastMessage.senderId !== auth.currentUser.uid) {
//         showNotification(lastMessage);
//       }
//     }
//   });
// };

// /**
//  * Show a browser notification for new messages
//  */
// const showNotification = (message) => {
//   if (Notification.permission === "granted") {
//     new Notification(`New message from ${message.senderName}`, {
//       body: message.text,
//       icon: "/default-avatar.png",
//     });
//   }
// };
