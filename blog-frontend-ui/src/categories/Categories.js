import React from "react";
import {Category} from "./Category";
import zipkinFetch from '../zipkin/zipkinFetch';

export class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
    }

    componentDidMount() {
        zipkinFetch(`${process.env.REACT_APP_BLOG_API}/categories`)
            .then(result => result.json())
            .then(categories => {
                this.setState({
                    categories: categories
                });
            });
    }

    render() {
        const categories = this.state.categories
            .map(category => {
                const c = category.map(x => x.name);
                const key = c.join('-');
                return <li key={key}>
                    <Category category={c}/>
                </li>
            });
        return (
            <div>
                <h2>Categories</h2>
                <ul className={'categories'}>
                    {categories}
                </ul>
            </div>
        );
    }
}