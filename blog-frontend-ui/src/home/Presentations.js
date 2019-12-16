import React from "react";
import 'pivotal-ui/css/ellipsis';

export class Presentations extends React.Component {
    state = {
        content: []
    };

    async componentDidMount() {
        const content = await fetch('https://raw.githubusercontent.com/categolj/misc/master/presos.json')
            .then(data => data.json());
        this.setState({
            content: content
        });
    }

    render() {
        const list = this.state.content.map(s =>
            <li key={s.name}><a href={s.href}>{s.name}</a> ({s.conference} / {s.date})</li>);
        return (<div>
            <h3 id="presentations" className={"home"}>Presentations</h3>
            <ul>
                {list}
            </ul>
        </div>);
    }

}
