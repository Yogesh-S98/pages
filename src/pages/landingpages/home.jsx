import React, { useEffect, useState, useContext, useRef } from "react";
import NavBar from "./navbar";
import './home.scss';

import likeUrl from '../../assets/heart.png';
import redlikeUrl from '../../assets/redheart.png';
import { Postlikes, addLikes, getPosts, getSavePosts, getSaved, saveLike, savePosts } from "../../googleSignIn/config";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UploadPosts from "./uploadPost/uploadPost";


function Home() {
    const [name, setname] = useState();
    const [userId, setUserId] = useState('');
    const [list, setList] = useState([]);
    const [loading, setloading] = useState(true);
    const [file, setFiles] = useState(null);
    const [show, setShow] = useState(false);
    const [like, setLike] = useState([]);
    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);
    const updateValue = (e) => {
        setname(e);
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
    const removeLike = (item, value, list) => {
        const array = list.likes.map((d) => {
            return d;
        })
        console.log('dsaf', array);
    }
    const addLike = async (item, value, list) => {
        const array = list.likes.map((d) => {
            return d;
        })
        array.push({ postId: item, like: value, userId: userId })
        await addLikes({ likes: array, postId: item });
        load();
    }
    const myLikes = (item, value) => {
        console.log('sadfa', item, value);
        return (
            <div>
                <img src={redlikeUrl} onClick={() => handleLike(item.postId, false, value)} width={20} />
            </div>
        )
    }
    const likesList = (item, value) => {
        const set = value.likes.filter((d) => d.userId === userId && d.like === true);
        console.log('dsafa', set);
        return (
            <div>
                {
                    set.map((d) => myLikes(d, value))
                }
            {/* {
            item.userId === userId && item.like !== false ?
            (item.userId === userId && item.like === true) ? <img src={redlikeUrl} onClick={() => handleLike(item.postId, false, value)} width={20} />
                    : <img src={likeUrl} onClick={() => addLike(item.postId, true, value)}  width={20} />
                : <img src={likeUrl} onClick={() => addLike(item.postId, true, value)}  width={20} />
            } */}
            </div>
        )
    }
    const filterLikes = item => {
        console.log('asdfa', item);
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
                    <img className="post-userlogo" src={item.user.photoURL} width={30}/>
                    <div className="post-user">{item.user.displayName}</div>
                </div>
                <img className="post-image" src={item.file} style={{width: '100%'}} />
                {item.message.length > 0 ? <div className="post-description">
                    {item.message}
                </div> : ''}
                <div className="post-sub">
                    <div className="likes-div">
                    { item.likes === 'under'
                        ? <img src={likeUrl} onClick={() => handleLike(item.id, true)}  width={20} />
                        : item.likes.filter((d) => d.like === true && d.userId === userId).length > 0 ? 
                        item.likes.filter((d) => d.like === true && d.userId === userId)
                        .map((d) => (
                            <div>
                                <img src={redlikeUrl} onClick={() => addLike(d.postId, false, item)}  width={20} />
                            </div>
                        )) : <img src={likeUrl} onClick={() => addLike(item.id, true, item)}  width={20} />
                    }
                    </div>
                    <div style={{ paddingLeft: '5px', paddingTop: '2px' }}>{
                     item.likes === 'under' ? '' : item.likes.filter((x) => x.like).length === 0
                        ? '' : item.likes.filter((x) => x.like).length}</div>
                </div>
                </div>
            </Col>
            </div>
        )
    }
    const updateFile = (event) => {
        // setFiles(event.target.files);
        setFiles(event.target.files[0]);
    }
    const Submit = async (file) => {
        const result = await savePosts({ name, file });
        if (result) {
            setname('');
            setShow(false);
            load();
        }
    }
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
                    </div>
                    <div >
                    </div>
                    <Row style={{margin: '0px'}}>
                    <Col>
                    <Col lg='9' style={{display: 'flex', justifyContent: 'end'}}>
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