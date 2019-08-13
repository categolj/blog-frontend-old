import React from "react";
import {Panel} from 'pivotal-ui/react/panels';

export class NoMatch extends React.Component {
    render() {
        return (
            <Panel>
                <h2>404 Not Found</h2>
                <p>
                    ¯\_(ツ)_/¯
                </p>
            </Panel>
        );
    }
}