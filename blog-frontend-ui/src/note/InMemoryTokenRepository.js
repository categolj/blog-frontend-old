class InMemoryTokenRepository {

    loadToken() {
        return this.token;
    }

    save(token) {
        this.token = token;
    }

    clear() {
        this.token = null;
    }
}

export default new InMemoryTokenRepository();