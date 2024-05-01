import React from "react";
import { useParams } from 'react-router-dom';
import { getDetails, updateUser } from "../googleSignIn/config";
import Loading from "./loading";
import { Col, FloatingLabel, Modal } from "react-bootstrap";
import { InputGroup, Form, Button } from "react-bootstrap";
import edit from '../assets/pencil.svg';
import NavBar from "../pages/landingpages/navbar";


function withParams(Component) {
  return props => {
      const params = useParams();
      return <Component {...props} params={params} />;
  } 
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        userProfile: null,
        users: '',
        loading: true,
        show: false,
        logo: '',
        profile: {
          logo: '',
          file: '',
          name: ''
        }
      }
      this.inputRef = React.createRef();
      this.fetchData = this.fetchData.bind(this);
      this.updateProfile = this.updateProfile.bind(this);
      this.uploadProfile = this.uploadProfile.bind(this);
      this.handleFileChange = this.handleFileChange.bind(this);
      this.closeModal = this.closeModal.bind(this);
      // this.confirmProfile = this.confirmProfile.bind(this);
    }
    componentDidMount() {
      this.fetchData();
    }
    fetchData = () => {
      this.setState({ users: JSON.parse(localStorage.getItem('user')), loading: true });
      getDetails(this.props.params.id).then(res => {
        setTimeout(() => {
          this.setState({ loading: false });
        }, 3000);
        this.setState({ userProfile: res });
        this.setState({ profile: { name: res.name } });
      }).catch(error => {
          console.error('Error fetching user details:', error);
      });
    }
    uploadProfile = () => {
      const { userProfile, users } = this.state;
      if (userProfile.uid === users.uid) {
        this.inputRef.current.click();
      }
    }
    handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        this.setState({
          show: true,
          profile: {
            logo: URL.createObjectURL(file),
            file: file,
          } });
      }
      event.target.value = null;
    }
    closeModal = () => {
      this.setState({ show: false, profile: '' });
    }
    // confirmProfile = () => {
    //   const payload = {
    //     user: this.state.userProfile,
    //     file: this.state.profile.file
    //   }
    //   updateUser(payload).then(res => {
    //     if (res) {
    //       localStorage.setItem('user', JSON.stringify(res));
    //       this.setState({ show: false });
    //     }
    //   })
    // }
    updateName = (event) => {
      this.setState({ profile: { name: event.target.value } });
    }
    updateProfile = () => {
      if (this.state.profile.name !== this.state.userProfile.name || this.state.profile.file) {
        this.setState({ loading: true });
        // let payload = this.state.userProfile;
        // payload.name = this.state.Name;
        const payload = {
          user: this.state.userProfile,
          profile: this.state.profile,
          file: this.state.profile.file
        }
        updateUser(payload).then(res => {
          if (res) {
            localStorage.setItem('user', JSON.stringify(res));
            this.setState({ loading: false });
            this.setState({ show: false });
            this.setState({ profile: res });
          }
        })
      }
    }
    render() {
      const { userProfile, users, loading, show, profile } = this.state;
        return (
          <div>
            { loading && <Loading></Loading> }
            { userProfile ? 
              <Col className="p-3">
                <Col className="pb-2 h4">Profile</Col>
                <Col xs='10' lg='5'
                  className="p-2 border border-#dedede rounded-2">
                    <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={this.handleFileChange}
                    style={{ display: 'none' }} // Hide the input
                    ref={this.inputRef} // Reference to the input element
                />
                <Col lg='2'>
                  <img
                    className="rounded-circle"
                    src={userProfile.avatar}
                    alt="setting-prf" width={100} height={100} />
                    <div
                      className="d-flex justify-content-end">
                      <div style={{ paddingRight: '30px', marginTop: '-30px' }}>
                        <img 
                          className="cursor-pointer"
                          onClick={this.uploadProfile} src={edit} width={25}/>
                      </div>
                    </div>
                </Col>
                    <Col lg='8' className="p-2 pt-4">
                      <label className="input-label">Name</label>
                      <InputGroup>
                        <Form.Control
                          className="input-field"
                          value={profile.name}
                          disabled={userProfile.uid !== users.uid}
                          onChange={this.updateName}
                          />
                      </InputGroup>
                    </Col>
                      <Col className="d-flex justify-content-end">
                      <Button
                          onClick={this.updateProfile}
                          >
                          Update
                      </Button>
                      </Col>
                </Col>
                <Modal size="lg" show={show}>
                    <Modal.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Modal.Title>
                            Upload Post
                        </Modal.Title>
                            <div
                                style={{fontSize: '18px',fontWeight: 600,
                                    color: '#919090', cursor: 'pointer'}}
                                onClick={this.closeModal}>X</div>
                    </Modal.Header>
                    <Modal.Body>
                      <img src={profile.logo} width={150} height={150} />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={this.closeModal}>cancel</Button>
                      <Button onClick={this.updateProfile}>upload</Button>
                    </Modal.Footer>
                </Modal>
              </Col>
            : '' }
          </div>
        )
    }
}

export default withParams(Profile);