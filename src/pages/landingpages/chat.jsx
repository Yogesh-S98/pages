import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { auth, getConversationSummary, getLatestMessage, getOrCreateConversation, getUsersList, listenToMessages } from '../../googleSignIn/config';
import ProfileAvatar from '../../common/profileAvatar';
import { ChatContext } from '../../common/chatContext';

function Chat() {
    const [users, setUsers] = useState([]);
    const [summaries, setSummaries] = useState({});
    const { activeChatUserId } = useContext(ChatContext);


    const fetchUsers = async () => {
        try {
            const res = await getUsersList();
            setUsers(res);
            // Parallel fetching all conversation summaries
            const promises = res.map(async (user) => {
                if (user.uid !== auth.currentUser.uid) {
                const conversationId = await getOrCreateConversation(auth.currentUser.uid, user.uid);
                const summary = await getConversationSummary(conversationId);
                return { ...user, conversationId, summary };
                }
                return null;
            });

            const results = await Promise.all(promises);
            const newUsers = results.filter(item => item !== null); // Filter out null values

            newUsers.sort((a, b) => {
              const timeA = a.summary?.createdAt ? a.summary.createdAt.toMillis() : 0;
              const timeB = b.summary?.createdAt ? b.summary.createdAt.toMillis() : 0;
              return timeB - timeA; // latest first
            });
  
            setUsers(newUsers);

            const newSummaries = {};

            results.forEach((item) => {
                if (item) {
                newSummaries[item.uid] = item.summary;
                }
            });
            setSummaries(newSummaries);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const requestNotificationPermission = () => {
        if (Notification.permission !== 'granted') {
          Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
              console.warn('Notifications permission denied');
            } else {
              console.log('Notifications permission granted');
            }
          });
        }
      };

    useEffect(() => {
        fetchUsers();
        requestNotificationPermission();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
          users.forEach(user => {
            // Start listening to messages
            if (user.conversationId) {
              listenToMessages(user.conversationId, (newMessage) => {
                if (newMessage.from !== auth.currentUser.uid) {
                    if (activeChatUserId === user.uid) {
                        const notification = new Notification(`New message from ${user.name}`, {
                          body: newMessage.text,
                          icon: user.avatar,
                        });
                        notification.onclick = (event) => {
                            event.preventDefault(); // Prevent default browser behavior
                            window.focus(); // Focus the tab if it's in the background
                            window.location.href = `/chat/${user.uid}`; // Navigate to chat page
                        };
                      } else {
                        // console.log('No notification - already chatting with', user.name);
                      }
                }
              });
            }
          });
        }
      }, [users]);
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Container>
                <div style={{justifyContent: 'end', display: 'flex'}}>
                    <Col lg="9" xs="12">
                        <Link
                            to={`/home`}
                            className="link">
                            Go Back
                        </Link>
                        <Col className='header'>Chat</Col>
                        <Col lg="8">
                            {users.map((user) => (
                                <Col key={user.uid} xs='auto' style={{
                                    padding: '15px'
                                }}>
                                    <div>
                                    <Link to={`/chat/${user?.uid}`} style={{ textDecoration: 'none', color: 'black' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                            style={{ borderRadius: '50px' }}
                                            src={user?.avatar}
                                            alt="User Avatar"
                                            width={30}
                                            height={30}
                                            />
                                            <div style={{ paddingLeft: '10px' }}>
                                            <div style={{ fontWeight: 600 }}>{user?.name}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                                {summaries[user?.uid]?.text || "No messages yet"}
                                            </div>
                                            </div>
                                        </div>
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