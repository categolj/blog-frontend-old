class NoteService {
    async login(email, password) {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        formData.append('grant_type', 'password');
        const res = await fetch(`${process.env.REACT_APP_NOTE_API}/oauth/token`, {
            method: 'POST',
            body: formData,
        });
        if (res.ok) {
            return res.json().then(json => json.access_token);
        } else {
            throw new Error(JSON.stringify(await res.json()));
        }
    }

    async sendResetLink(email) {
        const res = await fetch(`${process.env.REACT_APP_NOTE_API}/password_reset/send_link`,
            {
                method: 'POST',
                body: JSON.stringify({email}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (res.ok) {
            return res.json();
        } else if (res.status === 404) {
            throw new Error(JSON.stringify({
                error: 'not found',
                message: `${email}は登録されていません。`
            }));
        } else {
            this.handleUnExpectedError();
        }
    }

    async resetPassword(resetId, newPassword) {
        const res = await fetch(`${process.env.REACT_APP_NOTE_API}/password_reset`,
            {
                method: 'POST',
                body: JSON.stringify({resetId, newPassword}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (res.ok) {
            return res.json();
        } else if (res.status === 400) {
            throw new Error(JSON.stringify(await res.json()));
        } else if (res.status === 404) {
            throw new Error(JSON.stringify({
                error: 'not found',
                message: `存在しないパスワードリセットリンクです。`
            }));
        } else {
            this.handleUnExpectedError();
        }
    }

    loadNotes(token) {
        return fetch(`${process.env.REACT_APP_NOTE_API}/notes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json());
    }

    async loadNoteByEntryId(entryId, token) {
        const res = await fetch(`${process.env.REACT_APP_NOTE_API}/notes/${entryId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            return res.json();
        } else if (res.status === 403) {
            throw new Error(JSON.stringify({
                error: 'forbidden',
                message: `記事が未購入または未アクティベートです。<br/>購入済みの場合は、<a href="https://note.com/makingx/m/m2dc6f318899c">note.com</a>の該当ページからアクティベートリンクをクリックしてください。`
            }));
        } else {
            this.handleUnExpectedError();
        }
    }

    async activateNote(noteId, token) {
        const res = await fetch(`${process.env.REACT_APP_NOTE_API}/notes/${noteId}/activate`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        if (res.ok) {
            return res.json();
        } else if (res.status === 404) {
            throw new Error(JSON.stringify({
                error: 'not found',
                message: `該当の記事は存在しません。`
            }));
        } else {
            this.handleUnExpectedError();
        }
    }

    handleUnExpectedError() {
        throw new Error(JSON.stringify({
            error: 'unexpected',
            message: '予期せぬエラーが発生しました。'
        }));
    }
}

export default new NoteService();