import React from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {SeriesList} from "./SeriesList";
import {Entry} from "../entries/Entry";
import {Link} from "react-router-dom";
import rsocketFactory from "../RSocketFactory";
import cbor from "cbor";

export class Series extends React.Component {
    state = {
        entries: {
            content: []
        }
    };

    async componentDidMount() {
        try {
            const rsocket = await rsocketFactory.getRSocket();
            const response = await rsocket.requestResponse({
                data: cbor.encode({tag: this.props.match.params.id, size: 200}),
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

    render() {
        const series = SeriesList.content.find(x => x.tag === this.props.match.params.id);
        const entries = this.state.entries.content
            .sort((x, y) => x.entryId - y.entryId)
            .map(entry => <li key={entry.entryId}>
                <Link to={`/entries/${entry.entryId}`}>{entry.frontMatter.title}</Link>
                <span className="visible-inline-on-wide">
                    {Entry.entryDate(entry)}
                </span>
            </li>);
        return (<Panel>
            <h2>{(series && series.name) || this.props.match.params.id}</h2>
            <ul className={"series"}>
                {entries}
            </ul>
        </Panel>);
    }

}