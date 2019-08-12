import React from "react";
import {Entries} from "./Entries";
import {Category} from "../categories/Category";

export class ByCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: {
                content: []
            }
        };
        this.param = props.location ? new URLSearchParams(props.location.search) : new URLSearchParams();
        props.history.listen((location) => this.onLocationChange(location));
    }

    onLocationChange(location) {
        if (location.pathname.startsWith("/categories/")) {
            this.param.set("page", 0);
            this.loadFromServer(location.pathname);
        }
    }

    componentDidMount() {
        this.loadFromServer(`/categories/${this.props.match.params.id}/entries`);
    }

    loadFromServer(path) {
        !this.param.has('size') && this.param.set('size', 30);
        fetch(`${process.env.REACT_APP_BLOG_API}${path}?${this.param}`)
            .then(result => result.json())
            .then(entries => {
                this.setState({
                    entries: entries
                });
            });
    }

    onSelect(event, selectedEvent) {
        this.param.set('page', selectedEvent.newActivePage - 1);
        this.loadFromServer(`/categories/${this.props.match.params.id}/entries`);
        this.props.history.push(`?${this.param}`);
    }

    render() {
        const category = this.props.match.params.id.split(',');
        return (<Entries
            label={'Category'}
            info={<Category category={category}/>}
            entries={this.state.entries}
            onSelect={(event, selectedEvent) => this.onSelect(event, selectedEvent)}
            history={this.props.history}
        />);
    }

}