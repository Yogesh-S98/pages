import React, { useEffect, useRef, useState } from "react";
import NavBar from "./navbar";
import './home.scss';

import likeUrl from '../../assets/heart.png';
import redlikeUrl from '../../assets/redheart.png';
import message from '../../assets/messages.png';
import { addLikes, getComments, getPost, getSavePosts, saveComment, saveLike, savePosts } from "../../googleSignIn/config";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import UploadPosts from "./uploadPost/uploadPost";
import CommentsList from "./uploadPost/commentsList";
// import { json } from "react-router-dom";


function Home() {
    const [name, setname] = useState();
    const [userId, setUserId] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [list, setList] = useState([]);
    const [loading, setloading] = useState(true);
    const [show, setShow] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState('');
    const [Idpost, setIdpost] = useState('');
    const commentsCom = useRef(null);
    const openComment = (value) => {
        setloading(true);
        setShowComment(true);
        commentapi(value);
    };
    const commentapi = async (val) => {
        getComments(val).then(res => {
            setIdpost(val);
            setCommentList(res);
            setloading(false);
        });
    }
    const closeComment = () => setShowComment(false);
    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);
    const updateComment = (event) => {
        setComment(event.target.value);
        console.log('dadf', event);
    }
    const load = async () => {
        getSavePosts().then(results => {
            setList(results);
            setloading(false);
        });
        return;
    }
    const handleLike = async (postId, value) => {
        await saveLike({ postId, like: value, userId: userId });
        load();
    }
    const sendComment = async () => {
        // let comments = [];
        // if (commentList) {
        //     comments = commentList.map((d) => {
        //         return d;
        //     })
        // };
        // comments.push({ postId: Idpost, comment: comment, userId: userId });
        // await saveComment({ comments: comments, postId: Idpost }).then(res => {
        //     if (res) {
        //         setComment('');
        //     }
        // });
        await saveComment({ postId: Idpost, comment: comment, userId: userId }).then(res => {
            if (res) {
                setComment('');
                if (commentsCom.current) {
                    commentsCom.current.loadList(Idpost);
                }
            }
        });
        // loadComment();
    }
    const addLike = async (item, value, list) => {
        const array = list.likes.map((d) => {
            return d;
        })
        array.push({ postId: item, like: value, userId: userId })
        await addLikes({ likes: array, postId: item });
        load();
    }
    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserId(user.uid);
        load();
    }, []);
    const renderList = (item) => {
        return (
            <div style={{padding: '10px', display: 'flex', justifyContent: 'center'}}>
            <Col xs lg='6' className="images-container">
                <div style={{display: 'block'}}>
                <div style={{display: 'flex'}}>
                    <img className="post-userlogo" alt="profile" src={item.user.photoURL} width={30}/>
                    <div className="post-user">{item.user.displayName}</div>
                </div>
                <img className="post-image" alt="post" src={item.file} style={{width: '100%'}} />
                {item.message.length > 0 ? <div className="post-description">
                    {item.message}
                </div> : ''}
                <div className="post-sub">
                    <div className="likes-div">
                    { item.likes === 'under'
                        ? <img alt="like" src={likeUrl} onClick={() => handleLike(item.id, true)}  width={20} />
                        : item.likes.filter((d) => d.like === true && d.userId === userId).length > 0 ? 
                        item.likes.filter((d) => d.like === true && d.userId === userId)
                        .map((d) => (
                            <div>
                                <img alt="redlike" src={redlikeUrl} onClick={() => addLike(d.postId, false, item)}  width={20} />
                            </div>
                        )) : <img alt="likeadd" src={likeUrl} onClick={() => addLike(item.id, true, item)}  width={20} />
                    }
                    </div>
                    <div style={{ paddingLeft: '5px', paddingTop: '2px' }}>{
                     item.likes === 'under' ? '' : item.likes.filter((x) => x.like).length === 0
                        ? '' : item.likes.filter((x) => x.like).length}</div>
                    <div className="comments-div" onClick={() => openComment(item.id)}>
                        <img src={message} alt="comment" width={20} />
                    </div>
                </div>
                </div>
            </Col>
            </div>
        )
    }
    const Submit = async (file) => {
        const result = await savePosts({ name, file });
        if (result) {
            setname('');
            setShow(false);
            load();
        }
    }
    // const renderComment = (item) => {
    //     return (
    //         <div>
    //             <div key={item.postId}>
    //                 <CommentsList
    //                     data={item}
    //                     >
    //                 </CommentsList>
    //             </div>
    //         </div>
    //     )
    // }
    if (loading) {
        return <div>'loading'</div>;
    }
    return (
        <div>
            <NavBar></NavBar>
            <Container fluid='sm' className="home-container">
                <div className="heading">
                    Welcome to pages
                </div>
                <div>
                    <div>
                        <Modal size="lg" show={show} className="upload-container">
                            <Modal.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Modal.Title>
                                    Upload Post
                                </Modal.Title>
                                    <div
                                        style={{fontSize: '18px',fontWeight: 600,
                                            color: '#919090', cursor: 'pointer'}}
                                        onClick={closeModal}>X</div>
                            </Modal.Header>
                            <Modal.Body>
                                <UploadPosts
                                    submitPost={Submit}
                                >
                                </UploadPosts>
                            </Modal.Body>
                        </Modal>
                        <Modal size="lg" show={showComment} className="comments-container">
                        <Modal.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Modal.Title>
                                    Comments
                                </Modal.Title>
                                    <div
                                        style={{fontSize: '18px',fontWeight: 600,
                                            color: '#919090', cursor: 'pointer'}}
                                        onClick={closeComment}>X</div>
                            </Modal.Header>
                            <Modal.Body>
                                { loading ? (<p>loading ...</p>) :
                                <div>
                                    <div>
                                    {/* {commentList ? commentList.map((item) => renderComment(item)) : ''} */}
                                    <CommentsList
                                        ref={commentsCom}
                                        data={commentList}
                                    ></CommentsList>
                                    </div>
                                    <div className="comments-input">
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            placeholder="Comment"
                                            aria-label="Comment"
                                            aria-describedby="basic-addon1"
                                            value={comment}
                                            onChange={updateComment}
                                            />
                                            <Button
                                                id="button-addon2"
                                                onClick={sendComment}
                                                >
                                                Send
                                            </Button>
                                    </InputGroup>
                                    </div>
                                </div>
                                }
                            </Modal.Body>
                        </Modal>
                    </div>
                    <div >
                    </div>
                    <Row style={{margin: '0px'}}>
                    <Col>
                    <Col lg='9' style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button onClick={openModal}>Upload</Button>
                    </Col>
                    { list.length > 0 ? 
                    list.map(renderList) : ''}
                    </Col>
                    </Row>
                </div>
                {/* <div className="form">
                    <input type="file" onChange={updateFile}></input>
                    <input className="inputs" value={name} onChange={e => updateValue(e.target.value)} />
                </div>
                <div>
                    <button onClick={submit}>New</button>
                </div>
                <div>
                    <button onClick={toaster}>toaster</button>
                </div> */}
            </Container>
        </div>
    )
}

export default Home;