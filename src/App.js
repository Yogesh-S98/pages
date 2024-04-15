import React, { Component, useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import Login from './pages/authPages/login';
import "./App.scss";
import Home from "./pages/landingpages/home";
import { ProtectRoute, ProtectRoute2 } from "./Auth";
import { ToastContainer } from 'react-toastify';


function App() {
        return (
          <div>
          <BrowserRouter>
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
            </Routes>
          </BrowserRouter>
          <ToastContainer></ToastContainer>
          </div>
        );
}

export default App;