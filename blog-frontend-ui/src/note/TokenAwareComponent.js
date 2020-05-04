import React from "react";
import 'pivotal-ui/css/ellipsis';
import tokenRepository from "./CompositeTokenRepository";
import {Redirect} from "react-router-dom";
import Jwt from "./Jwt";

export class TokenAwareComponent extends React.Component {
    state = {
        content: null,
        redirect: false,
        isLoaded: false,
    };

    async loadToken(loadContent) {
        let token = tokenRepository.loadToken();
        if (token) {
            const expiresIn = Jwt.decoded(token).exp - new Date().getTime() / 1000;
            if (expiresIn > 0) {
                this.token = token;
                this.setState({
                    isLoaded: true
                })
                try {
                    const content = await loadContent(token);
                    this.setState({content: content});
                } finally {
                    this.setState({
                        isLoaded: false
                    });
                }
            }
        }
        if (!this.token) {
            this.setState({redirect: true});
        }
    }

    getToken() {
        return this.token;
    }

    decodeToken() {
        return this.token && Jwt.decoded(this.token)
    }

    redirect() {
        return this.state.redirect && <Redirect to={{pathname: "/note/login"}}/>;
    }
}