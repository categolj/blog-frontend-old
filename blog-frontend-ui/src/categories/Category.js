import React from "react";
import {Link} from "react-router-dom";

export class Category extends React.Component {
    render() {
        if (this.props.category.length === 0) {
            return null;
        }
        const categories = [];
        const links = [<span key={'first'}>{`🗃 {`}</span>];
        this.props.category.forEach(c => {
            categories.push(c);
            const segment = categories.join(',');
            links.push(Category.link(segment, categories));
            links.push(<span key={segment + '-slash'}>{`/`}</span>);
        });
        links.pop();
        links.push(<span key={'last'}>{`}`}</span>);
        return links;
    }

    static link(segment, categories) {
        const name = categories[categories.length - 1];
        return <Link key={segment} to={`/categories/${segment}/entries`}>{`${name}`}</Link>;
    }
}