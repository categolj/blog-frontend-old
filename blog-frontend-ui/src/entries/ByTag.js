import React from "react";
import {Entries} from "./Entries";
import {Tag} from "../tags/Tag";

export class ByTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: {
                content: []
            }
        };
        this.param = props.location ? new URLSearchParams(props.location.search) : new URLSearchParams();
    }

    componentDidMount() {
        this.loadFromServer();
    }

    loadFromServer() {
        !this.param.has('size') && this.param.set('size', 30);
        fetch(`${process.env.REACT_APP_BLOG_API}/tags/${this.props.match.params.id}/entries?${this.param}`)
            .then(result => result.json())
            .then(entries => {
                this.setState({
                    entries: entries
                });
            });
    }

    onSelect(event, selectedEvent) {
        this.param.set('page', selectedEvent.newActivePage - 1);
        this.loadFromServer();
        this.props.history.push(`?${this.param}`);
    }

    render() {
        return (<Entries
            label={'Tag'}
            info={<Tag name={this.props.match.params.id}/>}
            entries={this.state.entries}
            onSelect={(event, selectedEvent) => this.onSelect(event, selectedEvent)}
            history={this.props.history}
        />);
    }

}