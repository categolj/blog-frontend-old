import React from "react";
import 'pivotal-ui/css/ellipsis';
import {Logout} from './Logout';
import Jwt from "./Jwt";
import tokenRepository from "./CompositeTokenRepository";

export class Welcome extends React.Component {
    constructor(props) {
        super(props);
        const token = tokenRepository.loadToken();
        this.decoded = token && Jwt.decoded(token);
    }

    render() {
        return (this.decoded && <p>{`ようこそ、${this.decoded.preferred_username}さん`}&nbsp;<Logout/></p>);
    }

}