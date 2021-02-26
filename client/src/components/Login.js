import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const auth = useAuth();

    const refName = useRef("");
    const refPassword = useRef("");

    function submitHandler() {
        auth.login(refName.current.value, refPassword.current.value);
    }

    return (
        <React.Fragment>
            <input
                type="text"
                ref={refName} />
            <input
                type="text"
                ref={refPassword} />
            <button onClick={submitHandler} type="submit" >Login</button>
        </React.Fragment>
    );
}

export default Login;