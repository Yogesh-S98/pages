import React from "react";
import { useParams } from 'react-router-dom';
import { getDetails, updateUser } from "../googleSignIn/config";
import Loading from "./loading";
import { Col } from "react-bootstrap";
import { InputGroup, Form, Button } from "react-bootstrap";
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
        Name: '',
        users: '',
        loading: false,
      }
      this.fetchData = this.fetchData.bind(this);
      this.updateProfile = this.updateProfile.bind(this);
    }
    componentDidMount() {
      this.fetchData();
    }
    fetchData = () => {
      this.setState({ users: JSON.parse(localStorage.getItem('user')) });
      getDetails(this.props.params.id).then(res => {
        this.setState({ userProfile: res });
        this.setState({ Name: res.name });
      }).catch(error => {
          console.error('Error fetching user details:', error);
      });
    }
    updateName = (event) => {
      this.setState({ Name: event.target.value });
    }
    updateProfile = () => {
      if (this.state.Name !== this.state.userProfile.name) {
        this.setState({ loading: true });
        let payload = this.state.userProfile;
        payload.name = this.state.Name;
        console.log('names', payload);
        updateUser(payload).then(res => {
          console.log('dsafafffff', res);
          if (res) {
            localStorage.setItem('user', JSON.stringify(res));
            this.setState({ loading: false });
          }
        })
      }
    }
    render() {
      const { userProfile, Name, users, loading } = this.state;
        return (
          <div>
            { userProfile && !loading ? 
              <Col className="p-3">
                <Col className="pb-2 h4">Profile</Col>
                <Col xs='10' lg='5'
                  className="p-2 border border-#dedede rounded-2">
                  <img
                    className="rounded-circle"
                    src={userProfile.avatar}
                    alt="setting-prf" width={50} />
                    <Col lg='8' className="p-2">
                      <InputGroup>
                        <Form.Control
                          placeholder="Name"
                          aria-label="Name"
                          value={Name}
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
              </Col>
            : <Loading height={'100vh'}></Loading> }
          </div>
        )
    }
}

export default withParams(Profile);