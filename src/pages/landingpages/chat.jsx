import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getUsersList } from '../../googleSignIn/config';
import ProfileAvatar from '../../common/profileAvatar';

function Chat() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await getUsersList();
            setUsers(res);
            console.log('Fetched users:', res); // Log the response here
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Container>
                <div style={{justifyContent: 'end', display: 'flex'}}>
                    <Col lg="9">
                        <Link
                            to={`/home`}
                            className="link">
                            Go Back
                        </Link>
                        <Col className='header'>Chat</Col>
                        <Col lg="8">
                            {users.map((user) => (
                                <Col key={user.uid} style={{
                                    padding: '15px'
                                }}>
                                    <div>
                                        <Link to={`/chat/${user?.uid}`} style={{ textDecoration: 'none', color: 'black' }}>
                                            <img style={{borderRadius: '50px'}} src={user?.avatar} alt="User Avatar" width={30} height={30} />
                                            <span style={{paddingLeft: '10px', fontWeight: 600}}>{user?.name}</span>
                                        </Link>
                                    </div>
                                </Col>
                            ))}
                        </Col>
                    </Col>
                </div>
            </Container>
        </div>
    )
}

export default Chat;