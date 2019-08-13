import React from "react";
import {Panel} from 'pivotal-ui/react/panels';
import {SeriesList} from "./SeriesList";
import {Entry} from "../entries/Entry";
import {Link} from "react-router-dom";

export class Series extends React.Component {
    state = {
        entries: {
            content: []
        }
    };

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BLOG_API}/tags/${this.props.match.params.id}/entries?size=200`)
            .then(result => result.json())
            .then(entries => {
                this.setState({
                    entries: entries
                });
            });
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