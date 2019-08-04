import React from "react";
import {Entries} from "./Entries";
import {Category} from "../categories/Category";

export class ByCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: []
        };
        props.history.listen((location) => this.onLocationChange(location));
    }

    onLocationChange(location) {
        if (location.pathname.startsWith("/categories/")) {
            fetch(`${process.env.REACT_APP_BLOG_API}/${location.pathname}?size=100`)
                .then(result => result.json())
                .then(entries => {
                    this.setState({
                        entries: entries.content
                    });
                });
        }
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BLOG_API}/categories/${this.props.match.params.id}/entries?size=100`)
            .then(result => result.json())
            .then(entries => {
                this.setState({
                    entries: entries.content
                });
            });
    }

    render() {
        const category = this.props.match.params.id.split(',');
        return (<Entries
            label={'Category'}
            info={<Category category={category}/>}
            entries={this.state.entries}/>);
    }

}