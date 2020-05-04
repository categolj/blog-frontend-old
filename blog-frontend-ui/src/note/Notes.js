import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Panel} from "pivotal-ui/react/panels";
import tokenRepository from "./CompositeTokenRepository";
import {Redirect} from "react-router-dom";
import Jwt from "./Jwt";
import noteService from "./NoteService";

export class Notes extends React.Component {
    state = {
        content: [],
        redirect: false,
    };

    async componentDidMount() {
        let token = tokenRepository.loadToken();
        if (token) {
            const expiresIn = Jwt.decoded(token).exp - new Date().getTime() / 1000;
            if (expiresIn > 0) {
                console.log(`Expires in ${expiresIn} sec.`);
                this.token = token;
                const notes = await noteService.loadNotes(token);
                this.setState({content: notes});
            }
        }
        if (!this.token) {
            this.setState({redirect: true});
        }
    }

    render() {
        const decoded = this.token && Jwt.decoded(this.token);
        return (<Panel>
            {this.state.redirect && <Redirect to={{pathname: "/note/login"}}/>}
            <h2 id="notes" className={"home"}>Note一覧</h2>
            <p>{decoded && `ようこそ、${decoded.preferred_username}さん`}</p>
            <pre><code>{JSON.stringify(this.state.content, null, '  ')}</code></pre>
        </Panel>);
    }

}