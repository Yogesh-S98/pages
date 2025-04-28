import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { auth, getDetails, getOrCreateConversation, getUserMessages, listenToMessages, sendUserMessage } from "../../../googleSignIn/config";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listenForNewMessages } from "../../../common/listenNotifications";
import { ChatContext } from "../../../App";

function ChatRoom() {
    const params = useParams();
    const [user, setUser] = useState({});
    const [text, setText] = useState("");
    const [chatId, setChatId] = useState('');
    const [messages, setMessages] = useState([]);
    const { setActiveChatUserId } = useContext(ChatContext);

    useEffect(() => {
        if (user?.uid) {
          setActiveChatUserId(user.uid);
        }
      
        return () => {
          setActiveChatUserId(null);  // Clear when leaving the chat room
        };
    }, [user?.uid]);

    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchUser = async () => {
        if (params?.id) {
            const res = await getDetails(params.id);
            setUser(res);
        }
    };

    const getMessagesList = async (chatId) => {
        try {
            const msgs = await getUserMessages(chatId);
            setMessages(msgs);
          } catch (err) {
            console.error('Failed to fetch messages:', err);
          }
    }

    const sendMessage = async () => {
        if (text.trim() === "") return;
        const result = await sendUserMessage(chatId, auth.currentUser.uid, text);
        if (result) {
            setText('');
            getMessagesList(chatId);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user?.uid) {
            const initChat = async () => {
                const convoId = await getOrCreateConversation(auth.currentUser.uid, user.uid);
                setChatId(convoId);
                getMessagesList(convoId);
            };
    
            initChat();
        }
    }, [user]);

    useEffect(() => {
        if (chatId) {
          const unsubscribe = listenToMessages(chatId, (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
          });
      
          return () => unsubscribe(); // Clean up listener
        }
      }, [chatId]);
    // useEffect(() => {
    //     const unsubscribe = listenForNewMessages(chatId, setMessages);
    
    //     return () => unsubscribe(); // cleanup listener on unmount
    // }, [chatId, setMessages]);
      
    return (
        <div>
            <Container style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(var(--vh, 1vh) * 80)' }}>
                <div style={{ flex: '1' }}>
                    <div style={{ display: 'flex', justifyContent: 'end' }} className="chat-header">
                        <Col lg="9">
                            <Link
                                to={`/chat`}
                                className="link">
                                Go Back
                            </Link>
                            <div className="pt-2">
                                <Link to={`/profile/${user?.uid}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    <img style={{borderRadius: '50px'}} src={user?.avatar} alt="User Avatar" width={30} height={30} />
                                    <span style={{paddingLeft: '10px', fontWeight: 600}}>{user?.name}</span>
                                </Link>
                            </div>
                        </Col>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'end' }} className="set-mobile-view">
                    <Col lg="9">
                        <Col lg="8">
                        <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: '70vh', overflowY: 'auto' }}>
                            {messages.map((msg) => {
                                const isMe = msg.from === auth.currentUser.uid;
                                return (
                                <div
                                    key={msg.id}
                                    style={{
                                    alignSelf: isMe ? "flex-end" : "flex-start",
                                    backgroundColor: isMe ? "#0084ff" : "#e4e6eb",
                                    color: isMe ? "white" : "black",
                                    padding: "10px 15px",
                                    borderRadius: "20px",
                                    maxWidth: "fit-content",
                                    wordWrap: "break-word",
                                    }}
                                >
                                    {msg.text}
                                </div>
                                );
                            })}
                            <div ref={bottomRef}></div>
                        </div>
                        </Col>
                    </Col>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Col lg="9">
                        <Col lg="8">
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Message"
                                    aria-label="Message"
                                    aria-describedby="basic-addon1"
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    />
                                    <Button
                                        id="button-addon2"
                                        onClick={sendMessage}
                                        >
                                        Send
                                    </Button>
                            </InputGroup>
                        </Col>
                    </Col>
                </div>
            </Container>
        </div>
    )
}

export default ChatRoom;