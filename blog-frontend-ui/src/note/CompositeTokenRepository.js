import inMemoryTokenRepository from "./InMemoryTokenRepository";
import localStorageTokenRepository from "./LocalStorageTokenRepository";

class CompositeTokenRepository {
    delegates = [
        inMemoryTokenRepository,
        localStorageTokenRepository,
    ];

    loadToken() {
        for (let delegate of this.delegates) {
            const token = delegate.loadToken();
            if (token) {
                return token;
            }
        }
        return null;
    }

    save(token) {
        throw new Error('Unsupported Operation!');
    }

    clear() {
        this.delegates.forEach(delegate => delegate.clear());
    }
}

export default new CompositeTokenRepository();