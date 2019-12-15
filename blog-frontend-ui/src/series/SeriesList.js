import React from "react";
import {Link} from "react-router-dom";

export class SeriesList extends React.Component {
    state = {
        content: []
    };

    async componentDidMount() {
        const content = await fetch('https://raw.githubusercontent.com/categolj/misc/master/series.json')
            .then(data => data.json());
        this.setState({
            content: content
        });
    }

    render() {
        const list = this.state.content.map(s =>
            <li key={s.name}><Link to={`/series/${s.tag}/entries`}>{s.name}</Link></li>);
        return (<div>
            <h3 id="series" className={"home"}>Series</h3>
            <ul>
                {list}
            </ul>
        </div>);
    }

}
