import React from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {Entry} from "../entries/Entry";
import {Link} from "react-router-dom";
import rsocketFactory from "../RSocketFactory";

export class Series extends React.Component {
    state = {
        entries: {
            content: []
        },
        series: []
    };

    async componentDidMount() {
        try {
            const rsocket = await rsocketFactory.getRSocket();
            const response = await rsocket.requestResponse({
                data: {tag: this.props.match.params.id, size: 200},
                metadata: rsocketFactory.routingMetadata('entries')
            });
            const series = await fetch('https://raw.githubusercontent.com/categolj/misc/master/series.json')
                .then(data => data.json());
            this.setState({
                entries: response.data,
                series: series
            });
        } catch (e) {
            console.error({e});
            this.setState({error: e});
        }
    }

    render() {
        const entries = this.state.entries.content
            .sort((a, b) => a.frontMatter.title.localeCompare(b.frontMatter.title))
            .map(entry => <li key={entry.entryId}>
                <Link to={`/entries/${entry.entryId}`}>{Series.cleanTile(entry.frontMatter.title)}</Link>
                <span className="visible-inline-on-wide">
                    {Entry.entryDate(entry)}
                </span>
            </li>);
        const series = this.state.series.find(x => x.tag === this.props.match.params.id);
        return (<Panel>
            <h2>{(series && series.name) || this.props.match.params.id}</h2>
            <ul className={"series"}>
                {entries}
            </ul>
        </Panel>);
    }

    static cleanTile(title) {
        return title.split('-').slice(1).join('-').trim();
    }
}