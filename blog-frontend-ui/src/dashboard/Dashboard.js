import React, {Component} from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {SLI} from "./SLI";
import {JvmMemoryUsedBytes} from "./JvmMemoryUsedBytes";

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
                <JvmMemoryUsedBytes application={'blog-frontend-server'}/>
                <JvmMemoryUsedBytes application={'blog-api'}/>
                <JvmMemoryUsedBytes application={'gateway'}/>
            </Panel>
        );
    }
}

