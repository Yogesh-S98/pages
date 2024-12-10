import React, { useState } from 'react';
import { signInWithGoogle} from '../../googleSignIn/config';
import { useNavigate } from 'react-router-dom';
import '../authPages/login.scss';
import loadingGif from '../../assets/loader.gif';
import { InputGroup, Form, Button, Col } from "react-bootstrap";
import { errorNotification } from '../../common/notification';

const Line = ({ className }) => {
  return <div className={className}></div>;
};

function Login() {
    const Navigate = useNavigate();
    const [loading,  setloading] = useState(Boolean);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [value,setValue] = useState('');
    const handleGoogleSingIn = async () => {
      try {
        setTimeout(() => {
          setloading(true);
        }, 1000);
        const result = await signInWithGoogle().then(async res => {
          
          if (res) {
            setTimeout(() => {
              setloading(false);
            }, 1000);
            localStorage.setItem('user', JSON.stringify(res));
            Navigate('/home');
          } else {
            setTimeout(() => {
              setloading(false);
            }, 1000);
          }
        });
        console.log('ada', result);
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
            { !loading ?
              <div className='block'>
                <div style={{paddingBottom: '20px'}}>
                  <img src={require('../../assets/loader.gif')} />
                </div>
                {/* <div className='sub-heading'>Login</div> */}
                <Button
                  onClick={handleGoogleSingIn} className='button'>
                  <img style={{ paddingRight: '5px' }} src={require('../../assets/Logo-google-icon-PNG.png')} width={20}/>Sign in with google
                </Button>
                {/* <div style={{ display: 'flex', alignItems: 'center', width: 300 }}>
                  <div style={{ marginRight: '10px' }} className='line'></div>
                  <div>Or</div>
                  <div style={{ marginLeft: '10px' }} className='line'></div>
                </div> */}
                {/* <div className='text-start'>
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
                        <Button onClick={createUser()}>
                          Login
                        </Button>
                </div> */}
              </div>
            : <Col style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <div>
                <img src={loadingGif} className='loading-gif' /><br/>
                Hold on🔥
              </div>
            </Col> }
          </div>
        </Col>
    );
}

export default Login;