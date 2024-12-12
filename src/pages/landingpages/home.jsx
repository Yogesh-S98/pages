import React, { useEffect, useRef, useState } from "react";
import NavBar from "./navbar";
import './home.scss';
import loadingGif from '../../assets/loader.gif';

import likeUrl from '../../assets/heart.png';
import redlikeUrl from '../../assets/redheart.png';
import message from '../../assets/messages.png';
import deleteIcon from '../../assets/delete.png';
import { addLikes, getComments, getPost, getSavePosts, removePost, saveComment, saveLike, savePosts } from "../../googleSignIn/config";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import UploadPosts from "./uploadPost/uploadPost";
import CommentsList from "./uploadPost/commentsList";
import Loading from "../../common/loading";
import ProfileAvatar from "../../common/profileAvatar";


function Home() {
    const [name, setname] = useState();
    const [userId, setUserId] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [list, setList] = useState([]);
    const [loading, setloading] = useState(true);
    const [imageload, setImageload] = useState(false);
    const [show, setShow] = useState(false);
    const [postDelete, setPostDelete] = useState(false);
    const [deleteObj, setDeleteObj] = useState({});
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState('');
    const [Idpost, setIdpost] = useState('');
    const commentsCom = useRef(null);
    const openComment = (value) => {
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
    const closeModal = () => {
        setShow(false);
    };
    const closeDeleteModal = () => setPostDelete(false);
    const updateComment = (event) => {
        setComment(event.target.value);
        console.log('dadf', event);
    }
    const load = async () => {
        getSavePosts().then(async (results) => {
            await setList(results);
            setTimeout(() => {
                setloading(false);
            }, 0);
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
        array.push({ postId: item, like: value, userId: userId });
        await addLikes({ likes: array, postId: item });
        load();
    }
    const removeLike = async (item, list) => {
        const filterLikes = list.likes.filter((d) => d.userId !== userId);
        await addLikes({ likes: filterLikes, postId: item });
        load();
    }
    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserId(user.uid);
        load();
    }, []);
    const renderList = (item, index) => {
        return (
            <div
                key={item.id}
                style={{padding: '10px', display: 'flex', justifyContent: 'center'}}>
            <Col xs lg='6' className="images-container">
                <div style={{display: 'block'}}>
                <ProfileAvatar data={item}></ProfileAvatar>
                {item.video && (
                    <video style={{width: '100%'}} controls autoPlay>
                        <source src={item.file} type="video/mp4" />
                    </video>
                )
                }
                {
                    !item.video && (
                        <img className="post-image" alt="post" src={item.file} style={{width: '100%', filter: item.filter}} />
                    )
                }
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
                                <img alt="redlike" src={redlikeUrl} onClick={() => removeLike(d.postId, item)}  width={20} />
                            </div>
                        )) : <img alt="likeadd" src={likeUrl} onClick={() => addLike(item.id, true, item)}  width={20} />
                    }
                    </div>
                    <div style={{ paddingLeft: '5px', paddingTop: '2px' }}>{
                     item.likes === 'under' ? '' : item.likes.filter((x) => x.like).length === 0
                        ? '' : item.likes.filter((x) => x.like).length}</div>
                    <div
                        style={{ cursor: 'pointer' }}
                        className="comments-div"
                        onClick={() => openComment(item.id)}>
                        <img src={message} alt="comment" width={20} />
                    </div>
                    <div>
                        {
                            userId === item.userId ? 
                            <img
                                onClick={() => removePosts(item)}
                                className="delete-icon"
                                src={deleteIcon}
                                alt="delete"
                                width={20} /> : ''
                        }
                    </div>
                </div>
                </div>
            </Col>
            </div>
        )
    }
    const Submit = async (file) => {
        const user = JSON.parse(localStorage.getItem('user'));
        setImageload(true);
        const payload = {
            name: file.file.name,
            file: file.file,
            video: file.file.type === 'video/mp4',
            note: file.note,
            filter: file.filter,
            user
        }
        const result = await savePosts(payload);
        if (result) {
            setImageload(false);
            setname('');
            setShow(false);
            load();
        }
    }
    const removePosts = async (item) => {
        setPostDelete(true);
        // const removeObject = {
        //     userId: item.userId,
        //     postId: item.id
        // }
        setDeleteObj(item);
        // await removePost(removeObject);
        // load();
    }
    const deletePost = async (item) => {
        const removeObject = {
            userId: item.userId,
            postId: item.id
        }
        setPostDelete(false);
        setDeleteObj({});
        await removePost(removeObject).then((res) => {
            setPostDelete(false);
            setDeleteObj({});
            load();
        }).catch((error) => {
            setPostDelete(false);
            setDeleteObj({}); 
            load();
        });
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
    // if (loading) {
    //     return <div>
    //         <Loading height={'100vh'}></Loading>
    //     </div>;
    // }
    return (
        <div>
            { loading && <Loading ></Loading> }
            <Container fluid='sm' className="home-container">
                
                <div>
                    <div>
                        <Modal size="md" show={show}>
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
                                { !imageload ?
                                <div><UploadPosts
                                    submitPost={Submit}
                                >
                                </UploadPosts></div>
                                : <Col style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <img src={loadingGif} className='loading-gif' />
                                </Col> }
                                
                            </Modal.Body>
                        </Modal>
                        <Modal size="md" show={showComment} className="comments-container">
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
                                
                            </Modal.Body>
                        </Modal>
                        <Modal
                            size="md"
                            dialogClassName="modal-50w"
                            show={postDelete}>
                            <Modal.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Modal.Title>
                                    Delete Post
                                </Modal.Title>
                                    <div
                                        style={{fontSize: '18px',fontWeight: 600,
                                            color: '#919090', cursor: 'pointer'}}
                                        onClick={closeDeleteModal}>X</div>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                {deleteObj.video && (
                                    <video style={{width: '100%'}} controls autoPlay>
                                        <source src={deleteObj.file} type="video/mp4" />
                                    </video>
                                )
                                }
                                {
                                    !deleteObj.video && (
                                        <img className="post-image" alt="post" src={deleteObj.file} style={{width: '100%'}} />
                                    )
                                }
                                    <Col className="pt-2" style={{display: 'flex', justifyContent: 'flex-end'}}>
                                        <Button onClick={() => deletePost(deleteObj)}>Delete</Button>
                                    </Col>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                    <div >
                    </div>
                    <Row style={{margin: '0px'}}>
                    <Col>
                    <div style={{fontSize: '3rem',
                    fontWeight: '800',
                    color: '#0d6efd', fontFamily: 'math',justifyContent: 'center', display: 'flex'}}>
                        <Col lg="6">Welcome to pages</Col>
                    </div>
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