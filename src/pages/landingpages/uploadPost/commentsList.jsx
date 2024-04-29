import React, { Component } from "react";
import { addReplyComment, getComments, getDetails, updateComment } from "../../../googleSignIn/config";
import { Col, Row } from "react-bootstrap";
import { json } from "react-router-dom";
import ProfileAvatar from "../../../common/profileAvatar";
import close from '../../../assets/close1437.jpg';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './comments.scss';
import Loading from "../../../common/loading";

class CommentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: null,
            commentEdit: false,
            editcomment: '',
            newComment: '',
            commentReply: false,
            replyData: '',
            replycomment: '',
            showMoreComments: 5,
            showReplyMore: 2,
        }
        this.renderlist = this.renderlist.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.commentRender = this.commentRender.bind(this);
        this.replyComment = this.replyComment.bind(this);
        this.renderReply = this.renderReply.bind(this)
    }

    loadList = (value) => {
        getComments(value).then(res => {
            this.setState({ comments: res });
        })
    }

    async componentDidMount() {
        setTimeout(() => {
            this.setState({ comments: this.props.data });
            console.log('dafas', this.props.data);
        }, 1000);
    }

    editComment = (value) => {
        console.log('dafas', value);
        this.setState({ commentEdit: true });
        this.setState({ editcomment: value });
        this.setState({ newComment: value.comment });
        // const items = this.state.comments.map(item => {
        //     if (item.userId === value.userId) {
        //         return { postId: value.postId, comment: 'hello', userId: value.userId };
        //     };
        //     return item;
        // })
        // console.log('items', items);
    }

    updateEditComment = (event) => {
        this.setState({ newComment: event.target.value });
    }

    updateReply = (event) => {
        this.setState({ replycomment: event.target.value });
    }

    updateComment = () => {
        const payload = {
            postId: this.state.editcomment.postId,
            comment: this.state.newComment,
            userId: this.state.editcomment.userId,
        }
        updateComment(payload, this.state.editcomment.id).then(res => {
            if (res) {
                this.loadList(this.state.editcomment.postId);
                this.setState({ commentEdit: false });
                this.setState({ editcomment: '' });
                this.setState({ newComment: '' });
            }
        })
    }

    replyComment = (value) => {
        this.setState({ commentReply: true });
        this.setState({ replyData: value });
    }

    sendReplyComment = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const addReply = this.state.replyData.replies 
            ? this.state.replyData.replies : [];
        addReply.push({ userId: user.uid, reply: this.state.replycomment })
        const payload = this.state.replyData;
        payload.replies = addReply;
        addReplyComment(payload).then(res => {
            if (res) {
                this.setState({ commentReply: false });
            }
        })
    }

    closeModal = () => {
        this.setState({ commentEdit: false });
    }

    closeReply = () => {
        this.setState({ commentReply: false });
    }

    renderEdit = item => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (item.userId === user.uid) {
            return (
                <Col
                    xs='5' lg="1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.editComment(item)}>
                    Edit
                </Col>
            )
        }
    }

    renderReply = item => {
        return (
            <div>
                <ProfileAvatar data={item}></ProfileAvatar>
                <div className="ps-5">{item.reply}</div>
            </div>
        )
    }

    handleShowmoreReply = () => {
        this.setState(prevState => ({
            showReplyMore: prevState.showReplyMore + 5
        }));
    }

    commentRender = (item) => {
        
        const {
            editcomment,
            commentEdit, 
            newComment, 
            commentReply,
            replyData,
            replycomment,
            showReplyMore
        } = this.state;
        return (
            <div key={item.id}>
                <Col>
                    {
                        commentEdit && editcomment.id === item.id ? 
                        <div style={{ display: 'flex' }}>
                            <div>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Comment"
                                    aria-label="Comment"
                                    aria-describedby="basic-addon1"
                                    value={newComment}
                                    onChange={this.updateEditComment}
                                    />
                                    <Button
                                        id="button-addon2"
                                        onClick={this.updateComment}
                                        >
                                        Update
                                    </Button>
                            </InputGroup>
                            </div>
                            <div
                                className="editbutton"
                                style={{
                                    paddingLeft: '5px',
                                    paddingTop: '5px'
                                }}
                                onClick={this.closeModal}>
                                <img src={close} width={30} />
                            </div>
                        </div> :
                        <div>
                            {item.comment}
                            <div className="ps-3 m-0">{ item.replies ?
                                <div>
                                    {item.replies.slice(0, showReplyMore).map(this.renderReply)}
                                    {showReplyMore < item.replies.length && (
                                        <div>
                                        <div
                                            className="ps-3 pt-2"
                                            style={{ cursor: 'pointer', fontWeight: 600 }}
                                            onClick={this.handleShowmoreReply}>
                                            Show More
                                        </div>
                                        </div>
                                    )}
                                </div> : ''}
                            </div>
                            {
                                commentReply && replyData.id === item.id ?
                                <div className="pt-2 d-flex">
                                    <div>
                                    <InputGroup>
                                        <Form.Control
                                            placeholder="Reply Comment"
                                            aria-label="Reply Comment"
                                            aria-describedby="basic-addon1"
                                            value={replycomment}
                                            onChange={this.updateReply}
                                            />
                                            <Button
                                                id="button-addon2"
                                                onClick={this.sendReplyComment}
                                                >
                                                Send Reply
                                            </Button>
                                    </InputGroup>
                                    </div>
                                    <div
                                        className="editbutton"
                                        style={{
                                            paddingLeft: '5px',
                                            paddingTop: '5px'
                                        }}
                                        onClick={this.closeReply}>
                                        <img src={close} width={30} />
                                    </div>
                                </div> : ''
                            }
                        </div>
                    }
                    <Row style={{ display: 'flex' }}>
                    <Col
                        style={{ cursor: 'pointer' }}
                        xs='5' lg="5"
                        onClick={() => this.replyComment(item)}>
                        Reply
                    </Col>{this.renderEdit(item)}
                    </Row>
                </Col>
            </div>
        )
    }

    renderlist = item => {
        return (
            <div>
                <Col style={{ display: 'flex' }}>
                <div>
                <ProfileAvatar data={item}></ProfileAvatar>
                <Col style={{ paddingLeft: '45px' }}>{this.commentRender(item)}</Col>
                </div>
                </Col>
            </div>
        )
    }

    handleShowmore = () => {
        this.setState(prevState => ({
            showMoreComments: prevState.showMoreComments + 5
        }));
    }

    render() {
        const { editcomment, showMoreComments, comments } = this.state;
        return (
            <div style={{ padding: '20px' }}>
                {comments
                    ? <div>
                        {comments.slice(0, showMoreComments).map(this.renderlist)}
                        {showMoreComments < comments.length && (
                            <div>
                            <div
                                className="ps-3 pt-2"
                                style={{ cursor: 'pointer', fontWeight: 600 }}
                                onClick={this.handleShowmore}>
                                Show More
                            </div>
                            </div>
                        )}
                      </div>
                        : <Loading></Loading>}
                {/* <Modal size="lg" show={this.state.commentEdit} className="upload-container">
                    <Modal.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Modal.Title>
                            Edit Comment
                        </Modal.Title>
                            <div
                                style={{fontSize: '18px',fontWeight: 600,
                                    color: '#919090', cursor: 'pointer'}}
                                onClick={this.closeModal}>X</div>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Comment"
                                aria-label="Comment"
                                aria-describedby="basic-addon1"
                                value={editcomment}
                                // onChange={updateComment}
                                />
                                <Button
                                    id="button-addon2"
                                    // onClick={sendComment}
                                    >
                                    Send
                                </Button>
                        </InputGroup>
                        </div>
                    </Modal.Body>
                </Modal> */}
            </div>
        )
    }
}

export default CommentsList;