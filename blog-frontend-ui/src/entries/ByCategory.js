import React from "react";
import {Entries} from "./Entries";
import {Category} from "../categories/Category";
import rsocketFactory from "../RSocketFactory";

export class ByCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: {
                content: []
            }
        };
        this.param = props.location ? new URLSearchParams(props.location.search) : new URLSearchParams();
        props.history.listen((location) => this.onLocationChange(location));
    }

    async onLocationChange(location) {
        if (location.pathname.startsWith("/categories/") && !location.search) {
            this.param.set("page", 0);
            this.loadFromServer(location.pathname.replace('/categories/', '').replace('/entries', ''));
        }
    }

    async componentDidMount() {
        this.loadFromServer(this.props.match.params.id);
    }

    async loadFromServer(categories) {
        !this.param.has('size') && this.param.set('size', 30);
        const message = Object.fromEntries(this.param);
        message.categories = categories.split(',');
        try {
            const rsocket = await rsocketFactory.getRSocket();
            const response = await rsocket.requestResponse({
                data: message,
                metadata: rsocketFactory.routingMetadata('entries')
            });
            this.setState({
                entries: response.data
            });
        } catch (e) {
            console.error({e});
            this.setState({error: e});
        }
    }

    async onSelect(event, selectedEvent) {
        this.param.set('page', selectedEvent.newActivePage - 1);
        this.loadFromServer(this.props.match.params.id);
        this.props.history.push(`?${this.param}`);
    }

    render() {
        const category = this.props.match.params.id.split(',');
        return (<Entries
            label={'Category'}
            info={<Category category={category}/>}
            entries={this.state.entries}
            onSelect={(event, selectedEvent) => this.onSelect(event, selectedEvent)}
            history={this.props.history}
        />);
    }

}