
import axios from 'axios';

import { STORAGE } from '../constants/auth'
import { getValue, setValue } from '../helpers/localStorage';

export default () => {
    const storage = getValue(STORAGE);

    let axiosInstance = null;

    console.log(storage.user);

    if (storage && storage.tokens && storage.user) {
        axiosInstance = axios.create({
            headers: {
                'authorization': `Bearer ${storage.tokens.accessToken}`,
                'user_id': storage.user._id,
            }
        });
    } else {
        axiosInstance = axios.create();
    }

    // Odpowiedz
    axiosInstance.interceptors.response.use(
        response => {
            // Aktualizacja tokenów.
            const tokens = {
                accessToken: response.headers['authorization'],
            };
            if (tokens.accessToken) {
                const storage = getValue(STORAGE);

                const newStorage = {
                    ...storage,
                    tokens
                }
                setValue(STORAGE, newStorage);
            }
            return response;
        },
        // Jeśli tokeny są niepoprawne (w przypadku gdy wygaście rownież refreshToken)
        err => {
            if (err.response.status === 401) {
                setValue(STORAGE, { user: null, tokens: null });
                window.location.reload();
            }
            return Promise.reject(err);
        }
    );

    return axiosInstance;
};














