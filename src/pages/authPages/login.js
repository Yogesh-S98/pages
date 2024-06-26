import React from 'react';
import { signInWithGoogle} from '../../googleSignIn/config';
import { useNavigate } from 'react-router-dom';
import '../authPages/login.scss';
import { Col } from 'react-bootstrap';

function Login() {
    const Navigate = useNavigate();
    // const [value,setValue] = useState('');
    const handleGoogleSingIn = async () => {
        await signInWithGoogle().then(res => {
          localStorage.setItem('user', JSON.stringify(res));
          if (res) {
            Navigate('/home');
          }
        });
      }
    return (
        <Col className='login-container' xs='10' lg='4'>
          <div className='login-div'>
            <div className='block'>
              <div className='heading'>Pages</div>
              <div className='sub-heading'>Login</div>
              <button onClick={handleGoogleSingIn} className='button'>Sign in with google</button>
            </div>
          </div>
        </Col>
    );
}

export default Login;