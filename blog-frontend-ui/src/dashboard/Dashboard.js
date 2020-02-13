import React, {Component} from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {SLI} from "./SLI";

export class Dashboard extends Component {
    ui = `${process.env.REACT_APP_BLOG_UI}`;

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Panel>
                <h2>Dashboard</h2>
                <SLI/>
            </Panel>
        );
    }
}

