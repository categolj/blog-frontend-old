import React from "react";
import {Entries} from "./Entries";
import {Tag} from "../tags/Tag";

export class ByTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        }
    }

    componentDidMount() {
        fetch(`https://blog-api.ik.am/tags/${this.props.match.params.id}/entries?size=100`)
            .then(result => result.json())
            .then(entries => {
                this.setState({
                    entries: entries.content
                });
            });
    }

    render() {
        return (<Entries
            label={'Tag'}
            info={<Tag name={this.props.match.params.id}/>}
            entries={this.state.entries}/>);
    }

}