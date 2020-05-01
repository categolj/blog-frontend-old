import zipkinFetch from "../ZipkinFetch";

class LikeService {
    constructor() {
        this.fetch = zipkinFetch.wrap('like');
    }

    loadLikes(entryId) {
        return this.fetch(`${process.env.REACT_APP_LIKE_API}/likes/${entryId}`)
            .then(res => res.json());
    }

    postLikes(entryId) {
        return this.fetch(`${process.env.REACT_APP_LIKE_API}/likes/${entryId}`, {method: 'POST'})
            .then(res => res.json());
    }
}

export default new LikeService();