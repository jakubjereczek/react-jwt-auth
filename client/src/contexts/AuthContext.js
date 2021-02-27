import React, { useContext, useState, useEffect } from 'react';

import { useLocalStorage } from '../hooks';
import { STORAGE } from '../constants/auth'
import axiosApiInstance from '../axios/authService';

const AuthContext = React.createContext(undefined);

export const useAuth = () => {
    return useContext(AuthContext);
}

const URL = "http://127.0.0.1:80";

export const AuthProvider = ({ children }) => {

    const [setStorage, getStorage] = useLocalStorage(STORAGE);
    const [isLoading, setLoading] = useState(true);

    const storage = getStorage();
    const user = storage ? storage.user : null;

    const signup = async (name, password) => {
        setLoading(true)
        await axiosApiInstance().post(`${URL}/users/signup`,
            {
                name,
                password,
            })
        login(name, password);
    }

    const login = (name, password) => {
        setLoading(true)
        axiosApiInstance().post(`${URL}/users/login`,
            {
                name,
                password
            })
            .then(res => {
                const data = res.data;
                setStorage({
                    tokens: data.tokens,
                    user: data.user
                });

            })
            .catch(setLoading(false));

    }

    const logout = () => setStorage({ tokens: null, user: null });

    const getList = async () => await axiosApiInstance().post(`${URL}/users/users`);

    useEffect(() => setLoading(false), [setStorage])

    const values = {
        user,
        login,
        signup,
        logout,
        getList
    }

    return (
        <AuthContext.Provider value={values}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}