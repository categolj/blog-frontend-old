import React from "react";
import {Entries} from "./Entries";
import {Tag} from "../tags/Tag";
import rsocketFactory from "../RSocketFactory";
import cbor from "cbor";

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

    async componentDidMount() {
        this.loadFromServer();
    }

    async loadFromServer() {
        !this.param.has('size') && this.param.set('size', 30);
        this.param.set('tag', this.props.match.params.id);
        try {
            const rsocket = await rsocketFactory.getRSocket();
            const response = await rsocket.requestResponse({
                data: cbor.encode(Object.fromEntries(this.param)),
                metadata: rsocketFactory.routingMetadata('entries')
            });
            this.setState({
                entries: cbor.decode(response.data)
            });
        } catch (e) {
            console.error({e});
            this.setState({error: e});
        }
    }

    async onSelect(event, selectedEvent) {
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