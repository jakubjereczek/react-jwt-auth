import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
    const auth = useAuth();

    const refEmail = useRef(""), refPassword = useRef(""), refName = useRef("");

    function submitHandler() {
        // TODO: Sprawdzanie poprawności haseł - dwa inputy.
        // TODO: walidacja.
        auth.signup(refEmail.current.value, refPassword.current.value, refName.current.value);
    }

    return (
        <React.Fragment>
            <label htmlFor="email-input">Email address</label>
            <input
                type="text"
                ref={refEmail}
                id="email-input" />
            <label htmlFor="name-input">Name</label>
            <input
                type="text"
                ref={refName}
                id="name-input" />
            <label htmlFor="password-input">Password</label>
            <input
                type="text"
                ref={refPassword}
                id="password-input" />
            <label htmlFor="password-confirm-input">Password comfirm</label>
            <input
                type="text"
                ref={null}
                id="password-confirm-input" />
            <button onClick={submitHandler} type="submit" >Sign up</button>
        </React.Fragment>
    );
}

export default Signup;