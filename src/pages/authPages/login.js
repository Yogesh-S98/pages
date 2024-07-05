import React, { useState } from 'react';
import { signInWithGoogle} from '../../googleSignIn/config';
import { useNavigate } from 'react-router-dom';
import '../authPages/login.scss';
import { InputGroup, Form, Button, Col } from "react-bootstrap";
import { errorNotification } from '../../common/notification';

const Line = ({ className }) => {
  return <div className={className}></div>;
};

function Login() {
    const Navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [value,setValue] = useState('');
    const handleGoogleSingIn = async () => {
      try {
        await signInWithGoogle().then(res => {
          localStorage.setItem('user', JSON.stringify(res));
          if (res) {
            Navigate('/home');
          }
        });
      } catch (error) {
        errorNotification('error');
        Navigate('/login');
      }
        
      }
    // const createUser = async () => {
    //   const res = await signUpwithForm(
    //     email, password
    //   );
    //   console.log('dfasfa', res);
    // }
    return (
      <Col className='login-container' xs='10' lg='4'>
          <div className='login-div'>
            <div className='block'>
              <div className='heading'>Pages</div>
              <div className='sub-heading'>Login</div>
              <button onClick={handleGoogleSingIn} className='button'>
                <img style={{ paddingRight: '5px' }} src={require('../../assets/Logo-google-icon-PNG.png')} width={20}/>Sign in with google
              </button>
              <div style={{ display: 'flex', alignItems: 'center', width: 300 }}>
                <div style={{ marginRight: '10px' }} className='line'></div>
                <div>Or</div>
                <div style={{ marginLeft: '10px' }} className='line'></div>
              </div>
              <div className='text-start'>
                      <label className="input-label">Email</label>
                      <InputGroup>
                        <Form.Control
                          className="input-field"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          />
                      </InputGroup>
                      <label className="input-label">Password</label>
                      <InputGroup>
                        <Form.Control
                          className="input-field"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          />
                      </InputGroup>
                      {/* <Button onClick={createUser()}>
                        Login
                      </Button> */}
              </div>
            </div>
          </div>
        </Col>
    );
}

export default Login;