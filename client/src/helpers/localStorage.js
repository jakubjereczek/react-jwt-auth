export function getValue(key) {
    const item = window.localStorage.getItem(key);
    return JSON.parse(item);
}

export function setValue(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

