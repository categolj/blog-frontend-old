import React from "react";
import {UnexpectedError} from "../components/UnexpectedError";
import {Link} from "react-router-dom";
import {Loading} from "../components/Loading";

export class LatestEntries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: {
                content: []
            }
        };
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BLOG_API}/entries?size=5`)
            .then(result => result.json())
            .then(entries => {
                this.setState({
                    entries: entries
                });
            })
            .catch(e => {
                    console.log({e});
                    this.setState({error: e});
                }
            );
    }

    render() {
        if (this.state.error) {
            return <UnexpectedError message={this.state.error.message}/>
        }
        const entries = this.state.entries.content
            .map(entry => {
                return <li key={entry.entryId}>
                    <Link to={`/entries/${entry.entryId}`}>{entry.frontMatter.title}</Link>&nbsp;
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