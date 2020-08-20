class ReadCountService {
    readCountyById(entryId) {
        return fetch(`/entries/${entryId}/read_count`)
            .then(res => res.json());
    }

    readCountAll() {
        return fetch(`/entries/read_count`)
            .then(res => res.json());
    }
}

export default new ReadCountService();