import React from "react";
import {UnexpectedError} from "../components/UnexpectedError";
import {Link} from "react-router-dom";
import {Loading} from "../components/Loading";
import rsocketFactory from "../RSocketFactory";
import {Entry} from "../entries/Entry";

export class LatestEntries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: {
                content: []
            }
        };
    }

    async componentDidMount() {
        try {
            const rsocket = await rsocketFactory.getRSocket();
            const response = await rsocket.requestResponse({
                data: {size: 10},
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

    render() {
        if (this.state.error) {
            return <UnexpectedError message={this.state.error.message}/>
        }
        const entries = this.state.entries.content
            .map(entry => {
                return <li key={entry.entryId}>
                    <Link to={`/entries/${entry.entryId}`}>{Entry.cleanTitle(entry.frontMatter.title)}</Link>&nbsp;
                    <br className="invisible-inline-on-wide"/>
                    🗓 <span className={"visible-inline-on-wide"}>Updated at </span>{entry.updated.date}
                </li>;
            });
        const isLoaded = entries.length > 0;
        return (<div>
            <h3 id="latest-entries" className={"home"}>Latest Entries</h3>
            <ul>
                {isLoaded ? entries : <Loading/>}
            </ul>
        </div>);
    }

}