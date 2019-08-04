import React from "react";
import {Tag} from "./Tag";

export class Tags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: []
        };
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BLOG_API}/tags`)
            .then(result => result.json())
            .then(tags => {
                this.setState({
                    tags: tags
                });
            })
    }

    render() {
        const tags = this.state.tags
            .map(tag => <li key={tag.name}><Tag name={tag.name}/></li>);
        return (
            <div>
                <h2>Tags</h2>
                <ul className={'tags'}>
                    {tags}
                </ul>
            </div>
        );
    }
}

