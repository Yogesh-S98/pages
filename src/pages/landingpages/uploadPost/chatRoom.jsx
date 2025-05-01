import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { auth, deleteUserMessage, getDetails, getOrCreateConversation, getUserMessages, listenToMessages, sendUserMessage } from "../../../googleSignIn/config";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listenForNewMessages } from "../../../common/listenNotifications";
import { errorNotification, successNotification } from "../../../common/notification";
import copy from '../../../assets/copy.png';
import deleteIcon from '../../../assets/delete.png';
import { ChatContext } from "../../../common/chatContext";

function ChatRoom() {
    const params = useParams();
    const [user, setUser] = useState({});
    const [text, setText] = useState("");
    const [chatId, setChatId] = useState('');
    const [messages, setMessages] = useState([]);
    const { setActiveChatUserId } = useContext(ChatContext);
    const [menuMsgId, setMenuMsgId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (user?.uid) {
          setActiveChatUserId(user.uid);
        }
      
        return () => {
          setActiveChatUserId(null);  // Clear when leaving the chat room
        };
    }, [user?.uid]);

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

    const handleDeleteMessage = async (msgId) => {
        try {
            await deleteUserMessage(chatId, msgId);
            // successNotification('Message deleted successfully', 2000);
            getMessagesList(chatId);  // Re-fetch updated message list
        } catch (error) {
            // errorNotification(error.message || 'Failed to delete message', 2000);
        }
    };

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
                // ✅ Prevent duplicates
                setMessages(prev => {
                    const exists = prev.some(m => m.id === newMessage.id);
                    if (exists) return prev;
                    return [...prev, newMessage];
                });
            });
            return () => unsubscribe(); // Clean up
        }
    }, [chatId]);
    // useEffect(() => {
    //     const unsubscribe = listenForNewMessages(chatId, setMessages);
    
    //     return () => unsubscribe(); // cleanup listener on unmount
    // }, [chatId, setMessages]);
    let pressTimer = null;

    const handlePressStart = (msgId, e) => {
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);

        pressTimer = setTimeout(() => {
            setMenuMsgId(msgId);
            setMenuPosition({ x, y });
        }, 500); // 500ms long press
    };

    const handlePressEnd = () => {
        clearTimeout(pressTimer);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuMsgId(null);  // Close menu if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

      
    return (
        <div>
            <Container style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(var(--vh, 1vh) * 90)' }}>
                <div style={{ flex: '1', paddingBottom: '10px' }}>
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
                        <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: '78vh', overflowY: 'auto' }}>
                            {messages.map((msg) => {
                                const isMe = msg.from === auth.currentUser.uid;
                                return (
                                <div
                                    key={msg.id}
                                    onMouseDown={(e) => handlePressStart(msg.id, e)}
                                    onMouseUp={handlePressEnd}
                                    onTouchStart={(e) => handlePressStart(msg.id, e)}
                                    onTouchEnd={handlePressEnd}
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
                                    <div>
                                        {msg.text}
                                    </div>

                                    {menuMsgId === msg.id && (
                                        <div
                                            ref={menuRef}
                                            style={{
                                            position: "absolute",
                                            top: menuPosition.y,
                                            left: menuPosition.x,
                                            background: "white",
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            padding: "5px 10px",
                                            zIndex: 999,
                                            color: 'black'
                                            }}
                                            onClick={() => setMenuMsgId(null)}
                                        >
                                            <div className="p-2 cursor-pointer" onClick={() => {
                                                navigator.clipboard.writeText(msg.text)
                                                .then(() => {
                                                    successNotification('Message copied successfully', 2000)
                                                    handlePressEnd();
                                                })
                                                .catch(err => {
                                                    errorNotification(err, 2000);
                                                });
                                            }}><img src={copy} width={20} style={{ marginLeft: '2px', marginRight: '2px' }}/> Copy</div>
                                            {
                                                isMe && (
                                                    <div className="p-2 cursor-pointer" onClick={() => handleDeleteMessage(msg.id)}><img src={deleteIcon} width={25}/> Delete</div>
                                                )
                                            }
                                        </div>
                                        )}
                                </div>
                                );
                            })}
                            <div ref={bottomRef}></div>
                        </div>
                        </Col>
                    </Col>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Col lg="9" xs="12">
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