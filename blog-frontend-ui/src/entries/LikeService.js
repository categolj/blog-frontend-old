class LikeService {
    loadLikes(entryId) {
        return fetch(`https://like.dev.ik.am/likes/${entryId}`)
            .then(res => res.json());
    }

    postLikes(entryId) {
        return fetch(`https://like.dev.ik.am/likes/${entryId}`, {method: 'POST'})
            .then(res => res.json());
    }
}

export default new LikeService();