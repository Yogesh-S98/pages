import React, { useEffect, useState } from "react";
import { auth, getDetails } from "../../googleSignIn/config";
// import { Menu } from 'antd';
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../landingpages/navbar.scss';
import Stack from 'react-bootstrap/Stack';
import ProfileAvatar from "../../common/profileAvatar";
import { Col, Row } from "react-bootstrap";
// const { Item } = Menu;

function NavBar() {
    const params = useLocation();
    // const [user] = useAuthState(auth);
    const Navigate = useNavigate();
    const [menu, showMenu] = useState(false);
    const logout = () => {
        signOut(auth);
        Navigate('/login');
        localStorage.clear();
    }
    const Id = params.pathname.split('/')[2];
    const users = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        // if (user) {
        //     getProfile(user.uid);
        // }
    }, [users], [Id]);
    // const getProfile = item => {
    //     getDetails(item).then(res => {
    //         setUsers(res);
    //     });
    // }
    return (
        <div>
        { localStorage.getItem('user') ?
        <Stack className="nav" gap={10}>
            <div className="d-flex">
            <Col className="m-0 nav-items">
                <Col xs='1' sm='1' lg='1' className="p-3">
                <Link to={'/home'} className="link">
                    Home
                </Link>
                </Col>
                    <Col xs='1' sm='1' lg='1' className="p-3">
                <Link to={'/profile'} className="link">
                        Profile
                </Link>
                    </Col>
            </Col>
            {/* <div className="nav_logo">
                <img src={Mylogo} onClick={Dashboard} width='120' style={{cursor:"pointer"}}></img>
            </div> */}
            <div>
            {!Id ?
            <div className="nav-buttons">
                {users ? 
                    <div className='nav_right' onClick={() => showMenu(!menu)}>
                        <div className="fw-bolder fs-6">{users?users.name:'User Name'}</div>
                        <img src={users.avatar} alt="Avatar" className="avatar"></img>
                    </div> : '' }
                {
                    menu && <div className='actions'>
                        <div className="action">
                            <Link
                                to={`/profile/${users.uid}`}
                                style={{ textDecoration: 'none', color: 'black' }}>
                                    &nbsp;&nbsp;Settings
                            </Link>
                        </div>
                        <div className="action" onClick={logout}>&nbsp;&nbsp;Logout</div>
                    </div>
                }
            </div> : '' }
            </div>
            </div>
        </Stack>
        : '' }
        
    </div>
    )
}

export default NavBar;