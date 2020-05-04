import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Redirect} from "react-router-dom";
import {DefaultButton} from 'pivotal-ui/react/buttons';
import tokenRepository from "./CompositeTokenRepository";

export class Logout extends React.Component {
    state = {
        redirect: false,
    };

    logout() {
        tokenRepository.clear();
        this.setState({redirect: true});
    }

    redirect() {
        return this.state.redirect && <Redirect to={{pathname: "/note/login"}}/>;
    }

    render() {
        return (<React.Fragment>
            {this.redirect()}
            <DefaultButton alt onClick={() => this.logout()}>Logout</DefaultButton>
        </React.Fragment>);
    }

}