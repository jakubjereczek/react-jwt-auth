import { useEffect, useState } from 'react';

export default function useLocalStorage(key) {
    const [storageValue, setStorageValue] = useState();

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            setStorageValue(JSON.parse(item));
        } catch {
            window.localStorage.setItem(key, null);
            setStorageValue(null)
        }
    }, []);

    const setValue = value => {
        setStorageValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    const getValue = () => {
        // console.log(key + ": " + storageValue);
        return storageValue;
    };

    return [setValue, getValue];

}