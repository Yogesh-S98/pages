import React, { createContext, useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Login from './pages/authPages/login';
import "./App.scss";
import Home from "./pages/landingpages/home";
import { ProtectRoute, ProtectRoute2 } from "./Auth";
import { ToastContainer } from 'react-toastify';
import Profile from "./common/profile";
import NavBar from "./pages/landingpages/navbar";
import Chat from "./pages/landingpages/chat";
import ChatRoom from "./pages/landingpages/uploadPost/chatRoom";

export const ChatContext = createContext();

function App() {
    // useEffect(() => {
    //   if (Notification.permission !== "granted") {
    //     Notification.requestPermission();
    //   }
    // }, []);
    const [activeChatUserId, setActiveChatUserId] = useState(null);
    return (
      <div className="App">
        <ChatContext.Provider value={{ activeChatUserId, setActiveChatUserId }}>
      <BrowserRouter>
          <NavBar></NavBar>
        <Routes>
            <Route path="/" element={
              <ProtectRoute2>
              <Login/>
              </ProtectRoute2>
            }></Route>
            <Route path="/login" element={
              <ProtectRoute2>
              <Login/>
              </ProtectRoute2>
            }></Route>
            <Route path="/home" element={
              <ProtectRoute>
                <Home/>
              </ProtectRoute>
            }>
            </Route>
            <Route path="/profile/:id" element={
              <ProtectRoute>
                <Profile/>
              </ProtectRoute>
            }>
            </Route>
            <Route path="/chat" element={
              <ProtectRoute>
                <Chat/>
              </ProtectRoute>
            }>
            </Route>
            <Route path="/chat/:id" element={
              <ProtectRoute>
                <ChatRoom/>
              </ProtectRoute>
            }>
            </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer></ToastContainer>
      </ChatContext.Provider>
      </div>
    );
}

export default App;