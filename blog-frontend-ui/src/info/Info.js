import React from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {Block} from "./Block";

export class Info extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const ui = `${process.env.REACT_APP_BLOG_UI}`;
        const api = `${process.env.REACT_APP_BLOG_API}`;
        return (
            <Panel>
                <h2>Build Info</h2>
                <Block header={"UI"} url={ui}/>
                <Block header={"API"} url={api}/>
            </Panel>
        );
    }
}

