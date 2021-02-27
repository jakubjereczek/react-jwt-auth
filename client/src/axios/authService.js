
import axios from 'axios';

import { STORAGE } from '../constants/auth'
import { getValue, setValue } from '../helpers/localStorage';

export default () => {
    const storage = getValue(STORAGE);

    let axiosInstance = null;

    if (storage && storage.tokens) {
        axiosInstance = axios.create({
            headers: {
                'authorization': `Bearer ${storage.tokens.accessToken}`,
                'refresh-token': `${storage.tokens.refreshToken}`,
                'user': `${storage.user}`,
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
                refreshToken: response.headers['refresh-token']
            };
            if (tokens.accessToken && tokens.refreshToken) {
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














