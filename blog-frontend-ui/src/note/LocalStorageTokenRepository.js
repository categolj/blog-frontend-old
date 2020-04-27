class LocalStorageTokenRepository {

    loadToken() {
        return window.localStorage.getItem('token');
    }

    save(token) {
        window.localStorage.setItem('token', token);
    }

    clear() {
        window.localStorage.removeItem('token');
    }
}

export default new LocalStorageTokenRepository();