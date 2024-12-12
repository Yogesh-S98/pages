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
              // localStorage.setItem('user', JSON.stringify(res));
              Navigate('/home');
            }, 1);
          } else {
            setTimeout(() => {
              setloading(false);
            }, 1);
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
      <div className=''>
      <Col className='login-container background' xs='10' lg='6'>
          <div className='login-div'>
            { !loading ?
              <div className='block'>
                <div
                    style={{
                    fontFamily: 'math',paddingBottom: '40px' }}>
                      <div className='heading'>
                        Turn your stories into art with filters on <i>"Pages".</i></div>
                    <div style={{fontSize: '2rem',
                    fontWeight: '800',}}>Just chill and let the filters do the magic!</div>
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
              <div >
                <img src={loadingGif} className='loading-gif' /><br/>
                <div style={{fontSize: '3rem',fontFamily: 'math',
                    fontWeight: '800',
                    color: '#0d6efd'}}>Hold on🔥</div>
              </div>
            </Col> }
          </div>
      </Col>
      </div>
    );
}

export default Login;