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
            throw new Error(JSON.stringify({
                error: 'unexpected',
                message: '予期せぬエラーが発生しました。'
            }));
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
}

export default new NoteService();