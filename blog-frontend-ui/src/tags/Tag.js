import React from "react";
import {Link} from "react-router-dom";

export class Tag extends React.Component {
    render() {
        return (<Link to={`/tags/${this.props.name}/entries`}>{`🏷 ${this.props.name}`}</Link>);
    }
}