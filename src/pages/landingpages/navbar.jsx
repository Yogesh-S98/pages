import React, { Component, useEffect, useState } from "react";
import { auth } from "../../googleSignIn/config";
// import { Menu } from 'antd';
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import '../landingpages/navbar.scss';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
// const { Item } = Menu;

function NavBar() {
    const [user] = useAuthState(auth);
    const Navigate = useNavigate();
    const [menu, showMenu] = useState(false);
    const logout = () => {
        signOut(auth);
        Navigate('/login');
        localStorage.clear();
    }
    return (
        <div>
        <Stack className="nav" gap={10}>
            {/* <div className="nav_logo">
                <img src={Mylogo} onClick={Dashboard} width='120' style={{cursor:"pointer"}}></img>
            </div> */}
            <div className="nav-buttons">
                <div className='nav_right' onClick={() => showMenu(!menu)}>
                    <div>{user?user.displayName:'User Name'}</div>
                    {/* <div>{user?user.displayName:'User Name'}</div> */}
                    <img src={user.photoURL} alt="Avatar" className="avatar"></img>
                </div>
                {
                    menu && <div className='actions'>
                        <div className="action" onClick={logout}>&nbsp;&nbsp;Logout</div>
                    </div>
                }
            </div>
        </Stack>
        
    </div>
    )
}

export default NavBar;