import React from "react";
import 'pivotal-ui/css/ellipsis';

export class GitHub extends React.Component {
    state = {
        items: []
    };

    async componentDidMount() {
        const items = await fetch('https://api.github.com/search/repositories?q=user:making&sort=updated&order=desc')
            .then(data => data.json())
            .then(json => json.items.slice(0, 10));
        this.setState({
            items: items
        });
    }

    render() {
        const list = this.state.items.map(item =>
            <li key={item.id}><a href={item.html_url}
                                 target={'_blank'}>{item.full_name}</a>{item.description && ` (${item.description})`}
            </li>);
        return (<div>
            <h3 id="github" className={"home"}>Recent GitHub Updates</h3>
            <ul>
                {list}
            </ul>
        </div>);
    }
}
