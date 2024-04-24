import React, { Component } from "react";
import { getComments, getDetails, updateComment } from "../../../googleSignIn/config";
import { Col, Row } from "react-bootstrap";
import { json } from "react-router-dom";
import ProfileAvatar from "../../../common/profileAvatar";
import close from '../../../assets/close1437.jpg';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './comments.scss';

class CommentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: null,
            commentEdit: false,
            editcomment: '',
            newComment: ''
        }
        this.renderlist = this.renderlist.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.commentRender = this.commentRender.bind(this);
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

    closeModal = () => {
        this.setState({ commentEdit: false });
    }

    renderEdit = item => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (item.userId === user.uid) {
            return (
                <Col
                    xl lg="1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.editComment(item)}>
                    Edit
                </Col>
            )
        }
    }

    commentRender = (item) => {
        const { editcomment } = this.state;
        const { commentEdit } = this.state;
        const { newComment } = this.state;
        return (
            <div key={item.postId}>
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
                        </div> : <div>{item.comment}</div>
                    }
                    <Row style={{ display: 'flex' }}>
                    <Col xl lg="1">Reply</Col>{this.renderEdit(item)}
                    </Row>
                </Col>
            </div>
        )
    }

    renderlist = item => {
        return (
            <div key={item.postId}>
                <Col style={{ display: 'flex' }}>
                <div>
                <ProfileAvatar data={item}></ProfileAvatar>
                <Col style={{ paddingLeft: '45px' }}>{this.commentRender(item)}</Col>
                </div>
                </Col>
            </div>
        )
    }

    render() {
        const { editcomment } = this.state;
        return (
            <div style={{ padding: '20px' }}>
                {this.state.comments ? this.state.comments.map(this.renderlist) : 'Loading...'}
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