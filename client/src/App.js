
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext.js';

import AuthService from './axios/authService';

import Login from './components/Login';
import Signup from './components/Signup.js';


const App = () => {

  const [isLoginEnable, setLoginEnable] = useState(true);

  const auth = useAuth();
  const user = auth.user;

  return (
    <div className="App">
      {user ? (
        <React.Fragment>
          User: {user ? <h1>{user.name}</h1> : <h1>not login</h1>}
          <button onClick={() => auth.logout()}>Logout</button>
        </React.Fragment>
      ) : (
          <React.Fragment>
            <h2 onClick={() => setLoginEnable(!isLoginEnable)}>{isLoginEnable ? ("Login - click to change to sign up") : ("Sign up - click to change to login")}</h2>
            {isLoginEnable ? <Login /> : <Signup />}
          </React.Fragment>
        )
      }

      {/* Testowa metoda */}
      {<h2 onClick={() =>
        auth.getList()
          .then((res) => console.log(res))
          .catch((err) => console.log(err))}>GET LIST</h2>}
    </div>
  );
}

export default App;
