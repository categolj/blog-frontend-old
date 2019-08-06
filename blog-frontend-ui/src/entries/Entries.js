import React from "react";
import {Link} from "react-router-dom";
import {Category} from "../categories/Category";
import {Loading} from "../components/Loading";

export class Entries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        };
        this.param = props.location ? new URLSearchParams(props.location.search) : new URLSearchParams();
        if (props.history) {
            props.history.listen((location) => this.onLocationChange(location));
        }
    }

    componentDidMount() {
        if (!this.props.entries) {
            this.loadFromServer();
        }
    }

    onLocationChange(location) {
        this.param = new URLSearchParams(location.search);
        if (this.param.has('q')) {
            this.loadFromServer();
        }
    }

    loadFromServer() {
        this.param.set("size", 50);
        fetch(`${process.env.REACT_APP_BLOG_API}/entries?${this.param}`)
            .then(result => result.json())
            .then(entries => {
                this.setState({
                    entries: entries.content
                });
            });
    }

    entries() {
        return this.props.entries || this.state.entries;
    }

    render() {
        const entries = this.entries()
            .map(entry => {
                const categories = entry.frontMatter.categories.map(x => x.name);
                return <li key={entry.entryId}>
                    <span className={"visible-inline-on-wide"}><Category category={categories}/>&nbsp;</span>
                    <Link to={`/entries/${entry.entryId}`}>{entry.frontMatter.title}</Link>&nbsp;
                    <br className="invisible-inline-on-wide"/>
                    🗓 <span className={"visible-inline-on-wide"}>Updated at </span>{entry.updated.date}
                </li>;
            });
        return (<div>
            <h2>Entries {this.props.label ? <span>({this.props.label}: {this.props.info})</span> : <span/>}</h2>
            <ul className="entries">
                {entries.length > 0 ? entries : <Loading/>}
            </ul>
        </div>);
    }

}