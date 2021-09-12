import React from "react";
import {Link} from "react-router-dom";
import {Category} from "../categories/Category";
import {Loading} from "../components/Loading";
import {UnexpectedError} from "../components/UnexpectedError";
import {Pagination} from 'pivotal-ui/react/pagination';
import {Panel} from 'pivotal-ui/react/panels';
import {BackToTop} from 'pivotal-ui/react/back-to-top';
import {Entry} from "./Entry";
import rsocketFactory from '../RSocketFactory';
import {Helmet} from "react-helmet-async";

export class Entries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: {
                content: []
            }
        };
        this.param = props.location ? new URLSearchParams(props.location.search) : new URLSearchParams();
        if (props.history) {
            props.history.listen((location) => this.onLocationChange(location));
        }
    }

    async componentDidMount() {
        if (!this.props.entries) {
            this.loadFromServer();
        }
    }

    async onLocationChange(location) {
        this.param = new URLSearchParams(location.search);
        if (this.param.has('query')) {
            this.loadFromServer();
        }
    }

    async loadFromServer() {
        !this.param.has('size') && this.param.set('size', 30);
        try {
            const rsocket = await rsocketFactory.getRSocket();
            const response = await rsocket.requestResponse({
                data: Object.fromEntries(this.param),
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
        this.loadFromServer();
        this.props.history.push(`?${this.param}`);
    }

    entries() {
        return (this.props.entries && this.props.entries.content) || this.state.entries.content;
    }

    page() {
        const entries = this.props.entries || this.state.entries;
        return {
            totalPages: entries.totalPages,
            activePage: entries.number + 1,
        }
    }

    render() {
        if (this.state.error) {
            return <UnexpectedError message={this.state.error.message}/>
        }
        const entries = this.entries()
            .map(entry => {
                const categories = entry.frontMatter.categories.map(x => x.name);
                return <li key={entry.entryId}>
                    <span className={"visible-inline-on-wide"}><Category
                        category={categories}/>&nbsp;</span>
                    <Link
                        to={`/entries/${entry.entryId}`}>{Entry.cleanTitle(entry.frontMatter.title)}</Link>&nbsp;
                    <br className="invisible-inline-on-wide"/>
                    {Entry.entryDate(entry)}
                </li>;
            });
        const isLoaded = entries.length > 0;
        const page = this.page();
        const onSelect = this.props.onSelect || this.onSelect.bind(this);
        return (<Panel loading={!isLoaded}>
            <Helmet prioritizeSeoTags>
                <meta property="og:title" content="IK.AM"/>
                <meta property="og:type" content="blog"/>
                <meta property="og:description" content="@making's tech note"/>
                <meta property="og:url" content="https://ik.am/entries"/>
                <meta property="twitter:title" content="IK.AM"/>
                <meta property="twitter:description" content="@making's tech note"/>
                <meta property="twitter:url" content="https://ik.am/entries"/>
                <title>Entries - IK.AM</title>
            </Helmet>
            <h2>Entries {this.props.label ?
                <span>({this.props.label}: {this.props.info})</span> : <span/>}</h2>
            <ul className="entries">
                {isLoaded ? entries : <Loading/>}
            </ul>
            {page.totalPages > 1 &&
            <Pagination
                items={page.totalPages || 0}
                activePage={page.activePage || 0}
                onSelect={onSelect}
            />}
            <BackToTop/>
        </Panel>);
    }
}