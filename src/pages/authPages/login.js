import React from 'react';
import {auth,provider, signInWithGoogle} from '../../googleSignIn/config';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../authPages/login.scss';
import { notifi } from '../../common/notification';

function Login() {
    const Navigate = useNavigate();
    // const [value,setValue] = useState('');
    const handleGoogleSingIn = async () => {
        const user = await signInWithGoogle();
        localStorage.setItem('user', JSON.stringify(user));
        if (user) {
          Navigate('/home');
        }
      }
    return (
        <div className='login-container'>
          <div className='login-div'>
            <div className='block'>
            <div className='heading'>Pages</div>
            <div className='sub-heading'>Login</div>
        <button onClick={handleGoogleSingIn} className='button'>Sign in with google</button>
        </div>
        </div>
        </div>
    );
}

export default Login;