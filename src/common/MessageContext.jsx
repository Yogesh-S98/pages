// import React, { createContext, useState, useContext } from 'react';

// // Create the context
// const MessageContext = createContext();

// // Custom hook to use the message context
// export const useMessages = () => useContext(MessageContext);

// // Provider component to wrap the app
// export const MessageProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);

//   return (
//     <MessageContext.Provider value={{ messages, setMessages }}>
//       {children}
//     </MessageContext.Provider>
//   );
// };
