import React, {Component} from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {SLI} from "./SLI";
import {JvmMemoryUsedBytes} from "./JvmMemoryUsedBytes";
import urlProvider from "../urlProvider";

export class Dashboard extends Component {
    ui = `${urlProvider.BLOG_UI}`;

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Panel>
                <h2>Dashboard</h2>
                <SLI/>
                <JvmMemoryUsedBytes application={'blog-frontend'}/>
                <JvmMemoryUsedBytes application={'blog-api'}/>
                <JvmMemoryUsedBytes application={'note'}/>
            </Panel>
        );
    }
}

