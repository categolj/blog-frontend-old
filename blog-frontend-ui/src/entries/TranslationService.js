class TranslationService {
    translate(entryId, language) {
        return fetch(`/translations/${entryId}?language=${language}`)
            .then(res => res.json());
    }
}

export default new TranslationService();