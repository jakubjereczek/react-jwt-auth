import React, { useContext, useState, useEffect } from 'react';

import { useLocalStorage } from '../hooks';
import axios from 'axios';

const AuthContext = React.createContext(undefined);

export const useAuth = () => {
    return useContext(AuthContext);
}

const URL = "http://127.0.0.1:80";

export const AuthProvider = ({ children }) => {

    const [setStorage, getStorage] = useLocalStorage("storage");
    const [isLoading, setLoading] = useState(true);

    const storage = getStorage();
    const user = storage ? storage.user : null;

    const signup = async (name, password) => {
        setLoading(true)
        await axios.post(`${URL}/users/signup`,
            {
                name,
                password,
            })
            .catch((err) => {
                console.log('Bląd z Sign up: ' + err)
                setLoading(false);
            });
        login(name, password);
    }


    const login = (name, password) => {
        setLoading(true)
        axios.post(`${URL}/users/login`,
            {
                name,
                password
            })
            .then(res => {
                const data = res.data;
                setStorage({
                    expired: data.accessTokenExpires,
                    tokens: data.tokens,
                    user: data.user
                });
                setLoading(false);

            })
            .catch((err) => {
                console.log('Bląd z Login: ' + err)
                setLoading(false);
            });

    }

    const logout = () => setStorage({
        expired: null,
        tokens: null,
        user: null
    });

    function checkAuth() {
        // Jeśli dane sa przegądarce
        console.log(storage);
        if (storage) {
            setLoading(true)
            //...
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    // // Załadowanie danych.
    useEffect(() => checkAuth, [storage])


    const values = {
        user,
        login,
        signup,
        logout
    }

    return (
        <AuthContext.Provider value={values}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}