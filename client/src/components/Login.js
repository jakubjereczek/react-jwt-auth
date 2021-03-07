import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const auth = useAuth();

    const refEmail = useRef("");
    const refPassword = useRef("");

    function submitHandler() {
        auth.login(refEmail.current.value, refPassword.current.value);
    }

    return (
        <React.Fragment>
            <input
                type="text"
                ref={refEmail} />
            <input
                type="text"
                ref={refPassword} />
            <button onClick={submitHandler} type="submit" >Login</button>
        </React.Fragment>
    );
}

export default Login;