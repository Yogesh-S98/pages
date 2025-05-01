import { createContext, useState } from "react";


const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
    const [activeChatUserId, setActiveChatUserId] = useState(null);
    console.log('gettt', activeChatUserId)
    return (
        <ChatContext.Provider value={{ activeChatUserId, setActiveChatUserId }}>
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContext, ChatContextProvider }