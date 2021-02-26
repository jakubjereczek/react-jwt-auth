import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
    const auth = useAuth();

    const refName = useRef("");
    const refPassword = useRef("");

    function submitHandler() {
        auth.signup(refName.current.value, refPassword.current.value);
    }

    return (
        <React.Fragment>
            <input
                type="text"
                ref={refName} />
            <input
                type="text"
                ref={refPassword} />
            <button onClick={submitHandler} type="submit" >Sign up</button>
        </React.Fragment>
    );
}

export default Signup;