import React, { useState } from "react";
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


function App() {
        return (
          <div className="App">
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
            </Routes>
          </BrowserRouter>
          <ToastContainer></ToastContainer>
          </div>
        );
}

export default App;