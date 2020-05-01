class LikeService {
    loadLikes(entryId) {
        return fetch(`${process.env.REACT_APP_LIKE_API}/likes/${entryId}`)
            .then(res => res.json());
    }

    postLikes(entryId) {
        return fetch(`${process.env.REACT_APP_LIKE_API}/likes/${entryId}`, {method: 'POST'})
            .then(res => res.json());
    }
}

export default new LikeService();